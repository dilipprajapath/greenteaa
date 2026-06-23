# Green Tara Wellness — PRD

## Original Problem Statement
Premium, high-converting website for **Green Tara Wellness**, a luxury therapeutic spa in
Valasaravakkam, Chennai. Theme: "Where Healing Meets Tranquility." Calming palette (Deep
Forest Green, Soft Sage, Cream/Beige, Gold). Serif headings + sans body. Booking system,
service catalog, WhatsApp/click-to-call, Google Maps, testimonials, FAQ, admin dashboard.

## Architecture
- **Frontend**: React (CRA + craco), Tailwind, shadcn/ui, framer-motion, sonner. Fonts:
  Cormorant Garamond (display) + Outfit (body). Routes: `/` (Landing), `/admin`.
- **Backend**: FastAPI + Motor/MongoDB. JWT auth (httpOnly cookie + bearer fallback),
  admin seeded from env. All routes prefixed `/api`.
- **DB collections**: `users` (admin), `bookings`.

## User Choices (confirmed)
- Notifications: store booking + on-screen confirmation only (no email/SMS).
- Admin dashboard: yes (password protected).
- WhatsApp: +91 9080976360. Admin email: Prajapathdilip098@gmail.com.
- Hero: AI-generated spa image. Real customer photos featured throughout.

## Implemented (2026-06-23)
- Landing: sticky glass navbar, hero w/ CTAs, About (Green Tara story), 10-service catalog
  with Learn More modals, Gallery (real photos), multi-step Booking (service→duration→
  date/time→details→confirmation), "Find Us on Google" trust section (real listing photo),
  testimonials carousel, FAQ accordion, footer w/ Google Map embed + click-to-call.
- Floating WhatsApp + call buttons. SEO meta + JSON-LD (DaySpa schema).
- Booking API (public create w/ validation), admin dashboard (stats, filters, status mgmt),
  JWT auth. Backend tested 15/15, frontend flows 100%.

## Credentials
See `/app/memory/test_credentials.md`. Admin: Prajapathdilip098@gmail.com / GreenTara@2026.

## Backlog / Next
- P1: Email/SMS booking confirmations (Resend/Twilio) — deferred per user.
- P2: Time-slot availability/capacity, prevent double-booking; admin date filter/calendar view.
- P2: Anti-spam (honeypot/rate limit) on public booking; brute-force lockout on login.
- P2: Explicit CORS origins for production (currently `*`).
- P1: Replace baked-in "Sanctuary Spa" text in AI hero image if a cleaner asset is preferred.
