import os
import random
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage

from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# ------------ Config & App Setup ------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

# Secret key for sessions
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-this")

# DB Config (SQLite default)
db_url = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'sih_auth.db')}")
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Email Config (SMTP). If not provided, OTP will be printed in console for demo.
MAIL_SERVER = os.getenv("MAIL_SERVER", "")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "false").lower() == "true"
SENDER_EMAIL = os.getenv("SENDER_EMAIL", MAIL_USERNAME or "no-reply@example.com")


# ------------ Models ------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    otp_code = db.Column(db.String(6), nullable=True)
    otp_expires_at = db.Column(db.DateTime, nullable=True)
    last_login_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)


# ------------ Helpers ------------
def init_db():
    with app.app_context():
        db.create_all()


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send an email via SMTP. If SMTP not configured, print to console and return True (demo mode)."""
    if not MAIL_SERVER or not MAIL_USERNAME or not (MAIL_PASSWORD or MAIL_USE_SSL or MAIL_USE_TLS):
        # Demo mode: print to console
        print("=== DEMO EMAIL ===")
        print("To:", to_email)
        print("Subject:", subject)
        print("Body:\n", body)
        print("==================")
        return True

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg.set_content(body)

    try:
        if MAIL_USE_SSL:
            with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT) as server:
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
                if MAIL_USE_TLS:
                    server.starttls()
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.send_message(msg)
        return True
    except Exception as e:
        print("Email send failed:", e)
        return False


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def require_json(keys):
    data = request.get_json(silent=True) or {}
    missing = [k for k in keys if k not in data or data[k] in (None, "")]
    if missing:
        return None, jsonify({"ok": False, "error": f"Missing fields: {', '.join(missing)}"}), 400
    return data, None, None


# ------------ Routes ------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "message": "Auth service is running"}), 200


@app.route("/signup", methods=["POST"])
def signup():
    data, error_resp, status = require_json(["name", "email", "password"])
    if error_resp:
        return error_resp, status

    name = data["name"].strip()
    email = data["email"].lower().strip()
    password = data["password"]

    if User.query.filter_by(email=email).first():
        return jsonify({"ok": False, "error": "Email already registered"}), 409

    user = User(name=name, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"ok": True, "message": "Signup successful. Please login."}), 201


@app.route("/login", methods=["POST"])
def login():
    data, error_resp, status = require_json(["email", "password"])
    if error_resp:
        return error_resp, status

    email = data["email"].lower().strip()
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"ok": False, "error": "Invalid credentials"}), 401

    # Generate OTP
    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
    db.session.commit()

    # Send OTP
    subject = "Your 2FA OTP Code"
    body = f"Hello {user.name},\n\nYour OTP is: {otp}\nIt will expire in 5 minutes.\n\nIf you did not request this, please ignore."
    send_email(user.email, subject, body)

    return jsonify({"ok": True, "message": "OTP sent to your email. Verify to complete login."}), 200


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data, error_resp, status = require_json(["email", "otp"])
    if error_resp:
        return error_resp, status

    email = data["email"].lower().strip()
    otp = data["otp"].strip()

    user = User.query.filter_by(email=email).first()
    if not user or not user.otp_code:
        return jsonify({"ok": False, "error": "No OTP pending for this user"}), 400

    if user.otp_code != otp:
        return jsonify({"ok": False, "error": "Invalid OTP"}), 401

    if not user.otp_expires_at or datetime.utcnow() > user.otp_expires_at:
        return jsonify({"ok": False, "error": "OTP expired. Please request a new one."}), 401

    # OTP success → clear OTP and set session
    user.otp_code = None
    user.otp_expires_at = None
    user.last_login_at = datetime.utcnow()
    db.session.commit()

    session["user_id"] = user.id
    session["user_email"] = user.email

    return jsonify({"ok": True, "message": "Login success", "user": {"id": user.id, "name": user.name, "email": user.email}}), 200


@app.route("/resend-otp", methods=["POST"])
def resend_otp():
    data, error_resp, status = require_json(["email"])
    if error_resp:
        return error_resp, status

    email = data["email"].lower().strip()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"ok": False, "error": "User not found"}), 404

    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
    db.session.commit()

    subject = "Your new 2FA OTP Code"
    body = f"Hello {user.name},\n\nYour new OTP is: {otp}\nIt will expire in 5 minutes."
    send_email(user.email, subject, body)

    return jsonify({"ok": True, "message": "New OTP sent."}), 200


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True, "message": "Logged out"}), 200


@app.route("/protected", methods=["GET"])
def protected():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"ok": False, "error": "Unauthorized"}), 401

    user = User.query.get(uid)
    return jsonify({"ok": True, "message": f"Hello, {user.name}. You are logged in.", "user": {"id": user.id, "email": user.email}})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
