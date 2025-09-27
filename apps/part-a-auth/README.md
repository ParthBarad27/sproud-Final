# SIH Auth Backend (Flask) — Sign Up, Sign In + OTP 2FA

A clean Flask backend that provides secure authentication with OTP-based 2FA (via Email).

## ✨ Features
- Sign Up with password hashing (PBKDF2-SHA256)
- Sign In with email + password
- OTP (6-digit) generation, 5-minute expiry
- Email OTP via SMTP (or console print in demo mode)
- Resend OTP
- Flask session-based login
- Protected endpoint example
- SQLite by default (no setup)

## 🛠️ Setup

```bash
# 1) Extract the zip
cd sih_auth_backend

# 2) Create and activate virtualenv (recommended)
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# 3) Install dependencies
pip install -r requirements.txt

# 4) Copy env example
cp .env.example .env
# Then edit .env and set SECRET_KEY. Optionally set SMTP creds (Gmail app password recommended).
```

> If you don't set SMTP, OTP will be printed in the console for demo.

## ▶️ Run
```bash
python app.py
```
The server runs at `http://localhost:5000`

On first run, database tables are auto-created.

## 🔌 API (JSON)

### Health
```
GET /health
```

### Sign Up
```
POST /signup
Content-Type: application/json
{
  "name": "Kashaf",
  "email": "kashaf@example.com",
  "password": "StrongPass@123"
}
```

### Login (Generates OTP and sends to email)
```
POST /login
Content-Type: application/json
{
  "email": "kashaf@example.com",
  "password": "StrongPass@123"
}
```

### Verify OTP (Completes login, sets session)
```
POST /verify-otp
Content-Type: application/json
{
  "email": "kashaf@example.com",
  "otp": "123456"
}
```

### Resend OTP
```
POST /resend-otp
Content-Type: application/json
{
  "email": "kashaf@example.com"
}
```

### Protected route (requires successful OTP verification)
```
GET /protected
```

### Logout
```
POST /logout
```

## ✅ Demo Walkthrough (Postman or curl)

1) **Sign Up**
```bash
curl -X POST http://localhost:5000/signup -H "Content-Type: application/json" \
-d '{"name":"Kashaf","email":"kashaf@example.com","password":"Pass@123"}'
```

2) **Login → generates OTP**
```bash
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" \
-d '{"email":"kashaf@example.com","password":"Pass@123"}'
```

3) **Check terminal for OTP (if SMTP not set)**

4) **Verify OTP**
```bash
curl -X POST http://localhost:5000/verify-otp -H "Content-Type: application/json" \
-d '{"email":"kashaf@example.com","otp":"<PASTE_OTP_HERE>"}' \
-c cookies.txt -b cookies.txt
```
> `-c` and `-b` save and send cookies to persist the session.

5) **Access protected**
```bash
curl http://localhost:5000/protected -b cookies.txt
```

6) **Logout**
```bash
curl -X POST http://localhost:5000/logout -b cookies.txt
```

## 🔐 Notes for Judges
- Passwords are never stored in plain text (PBKDF2 hashing via Werkzeug).
- OTP is single-use and expires in 5 minutes.
- Sessions are signed via `SECRET_KEY`.
- Email is optional (demo mode prints OTP).

## 🚀 Next Steps (Optional Upgrades)
- Add rate limiting on /login and /resend-otp
- Store OTP attempts count and lock after N tries
- Replace sessions with JWT for mobile clients
- Add HTML forms or React UI
- Add email templates and logging
```

