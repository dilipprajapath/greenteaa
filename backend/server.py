from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, ConfigDict, field_validator

# ---------------------------------------------------------------------------
# DB
# ---------------------------------------------------------------------------
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'testdb')]

app = FastAPI(title="Green Tara Wellness API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"

# In-memory login attempt tracking for brute-force prevention
FAILED_LOGINS = {}
LOCKOUT_LIMIT = 5
LOCKOUT_DURATION = timedelta(minutes=15)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class BookingCreate(BaseModel):
    service: str
    duration: int
    date: str          # ISO date (YYYY-MM-DD)
    time: str          # e.g. "11:00 AM"
    name: str
    phone: str
    email: Optional[str] = ""
    notes: Optional[str] = ""

    @field_validator("duration")
    @classmethod
    def valid_duration(cls, v):
        if v not in (30, 60, 90, 120):
            raise ValueError("Duration must be 30, 60, 90 or 120 minutes")
        return v

    @field_validator("name", "phone")
    @classmethod
    def not_blank(cls, v):
        if not str(v).strip():
            raise ValueError("This field is required")
        return v.strip()


class Booking(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    service: str
    duration: int
    date: str
    time: str
    name: str
    phone: str
    email: Optional[str] = ""
    notes: Optional[str] = ""
    status: str = "pending"
    reference: str
    created_at: str


# ---------------------------------------------------------------------------
# Public routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Green Tara Wellness API"}


@api_router.post("/bookings")
async def create_booking(payload: BookingCreate):
    now = datetime.now(timezone.utc)
    reference = "GTW-" + now.strftime("%y%m%d") + "-" + str(ObjectId())[-5:].upper()
    doc = payload.model_dump()
    doc.update({
        "status": "pending",
        "reference": reference,
        "created_at": now.isoformat(),
    })
    result = await db.bookings.insert_one(doc)
    doc["_id"] = result.inserted_id
    return Booking(**doc).model_dump(by_alias=False)


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(payload: LoginInput, response: Response):
    email = payload.email.lower().strip()
    
    # Check brute-force lockout status
    now = datetime.now(timezone.utc)
    lockout = FAILED_LOGINS.get(email)
    if lockout and lockout["lockout_until"] and now < lockout["lockout_until"]:
        remaining = int((lockout["lockout_until"] - now).total_seconds())
        raise HTTPException(
            status_code=403, 
            detail=f"Too many failed login attempts. Locked out for another {remaining} seconds."
        )

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        # Track failed attempt
        if email not in FAILED_LOGINS:
            FAILED_LOGINS[email] = {"count": 1, "lockout_until": None}
        else:
            FAILED_LOGINS[email]["count"] += 1
            
        if FAILED_LOGINS[email]["count"] >= LOCKOUT_LIMIT:
            FAILED_LOGINS[email]["lockout_until"] = now + LOCKOUT_DURATION
            raise HTTPException(
                status_code=403,
                detail="Too many failed login attempts. Account locked for 15 minutes."
            )
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Reset failed attempts on successful login
    FAILED_LOGINS.pop(email, None)

    token = create_access_token(str(user["_id"]), email)
    response.set_cookie(key="access_token", value=token, httponly=True,
                        secure=True, samesite="none", max_age=43200, path="/")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"), "token": token}


@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["_id"], "email": current_user["email"],
            "name": current_user.get("name", "Admin"), "role": current_user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}


# ---------------------------------------------------------------------------
# Admin routes
# ---------------------------------------------------------------------------
@api_router.get("/bookings")
async def list_bookings(current_user: dict = Depends(get_current_user)):
    docs = await db.bookings.find().sort("created_at", -1).to_list(1000)
    return [Booking(**d).model_dump(by_alias=False) for d in docs]


@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, body: dict,
                                current_user: dict = Depends(get_current_user)):
    status = body.get("status")
    if status not in {"pending", "confirmed", "completed", "cancelled"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.bookings.update_one({"_id": ObjectId(booking_id)},
                                          {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Updated", "status": status}


@api_router.get("/bookings/stats")
async def booking_stats(current_user: dict = Depends(get_current_user)):
    total = await db.bookings.count_documents({})
    pending = await db.bookings.count_documents({"status": "pending"})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    return {"total": total, "pending": pending, "confirmed": confirmed}


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def seed_admin():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "Prajapathdilip098@gmail.com").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "GreenTara@2026")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:3000,http://127.0.0.1:3000,https://rejuvenate-spa-4.preview.emergentagent.com'
    ).split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
