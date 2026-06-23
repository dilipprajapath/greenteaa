"""Green Tara Wellness — backend API tests."""
import os
import re
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if os.environ.get('REACT_APP_BACKEND_URL') else None
if not BASE_URL:
    # Read from frontend/.env as fallback
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().strip('"').rstrip('/')

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
if not ADMIN_EMAIL or not ADMIN_PASSWORD:
    # Fallback: read admin credentials from backend/.env (never hardcode secrets here)
    try:
        with open("/app/backend/.env") as f:
            for line in f:
                if line.startswith("ADMIN_EMAIL="):
                    ADMIN_EMAIL = line.split("=", 1)[1].strip().strip('"')
                elif line.startswith("ADMIN_PASSWORD="):
                    ADMIN_PASSWORD = line.split("=", 1)[1].strip().strip('"')
    except FileNotFoundError:
        pass

assert ADMIN_EMAIL and ADMIN_PASSWORD, "Admin credentials must be provided via env/backend .env"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_session(api):
    """Login and return session with cookie + token."""
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {data['token']}",
    })
    # also carry cookies
    s.cookies.update(api.cookies)
    return s, data


# --- Health / root ---------------------------------------------------------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("message") == "Green Tara Wellness API"


# --- Auth -----------------------------------------------------------------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["email"].lower() == ADMIN_EMAIL.lower()
        assert d["role"] == "admin"
        assert isinstance(d["token"], str) and len(d["token"]) > 10
        # httpOnly cookie should be set
        assert "access_token" in r.cookies, "access_token cookie not set"

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401

    def test_login_unknown_user(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": "nope@example.com", "password": "x"})
        assert r.status_code == 401

    def test_me_requires_auth(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_bearer_token(self, admin_session):
        s, _ = admin_session
        r = s.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert r.json()["email"].lower() == ADMIN_EMAIL.lower()


# --- Bookings public create -----------------------------------------------
@pytest.fixture(scope="session")
def created_booking(api):
    payload = {
        "service": "Swedish Massage",
        "duration": 60,
        "date": "2026-03-15",
        "time": "11:30 AM",
        "name": "TEST_User Pytest",
        "phone": "+919999999999",
        "email": "test@example.com",
        "notes": "TEST booking",
    }
    r = api.post(f"{BASE_URL}/api/bookings", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    return data


class TestBookingCreate:
    def test_create_returns_reference(self, created_booking):
        d = created_booking
        assert d["status"] == "pending"
        assert re.match(r"^GTW-\d{6}-[A-Z0-9]{5}$", d["reference"]), f"Bad reference: {d['reference']}"
        assert d["service"] == "Swedish Massage"
        assert d["duration"] == 60
        assert "id" in d and d["id"]

    def test_create_validation_missing_fields(self, api):
        r = api.post(f"{BASE_URL}/api/bookings", json={"service": "X"})
        assert r.status_code == 422


# --- Admin: list / stats / patch ------------------------------------------
class TestAdminBookings:
    def test_list_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/bookings")
        assert r.status_code == 401

    def test_list_bookings(self, admin_session, created_booking):
        s, _ = admin_session
        r = s.get(f"{BASE_URL}/api/bookings")
        assert r.status_code == 200
        docs = r.json()
        assert isinstance(docs, list)
        refs = [d["reference"] for d in docs]
        assert created_booking["reference"] in refs

    def test_stats(self, admin_session):
        s, _ = admin_session
        r = s.get(f"{BASE_URL}/api/bookings/stats")
        assert r.status_code == 200
        d = r.json()
        for k in ("total", "pending", "confirmed"):
            assert k in d and isinstance(d[k], int)
        assert d["total"] >= 1

    def test_patch_status_confirms(self, admin_session, created_booking):
        s, _ = admin_session
        bid = created_booking["id"]
        r = s.patch(f"{BASE_URL}/api/bookings/{bid}/status",
                    json={"status": "confirmed"})
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "confirmed"
        # verify via list
        r = s.get(f"{BASE_URL}/api/bookings")
        match = [d for d in r.json() if d["id"] == bid]
        assert match and match[0]["status"] == "confirmed"

    def test_patch_invalid_status(self, admin_session, created_booking):
        s, _ = admin_session
        bid = created_booking["id"]
        r = s.patch(f"{BASE_URL}/api/bookings/{bid}/status",
                    json={"status": "garbage"})
        assert r.status_code == 400

    def test_patch_not_found(self, admin_session):
        s, _ = admin_session
        r = s.patch(f"{BASE_URL}/api/bookings/507f1f77bcf86cd799439011/status",
                    json={"status": "confirmed"})
        assert r.status_code == 404


# --- Logout ---------------------------------------------------------------
class TestLogout:
    def test_logout(self, api):
        # fresh login then logout
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        r = api.post(f"{BASE_URL}/api/auth/logout")
        assert r.status_code == 200
