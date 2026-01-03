# **SIH Auth Backend - Flask Authentication System**

![SIH Auth](https://img.shields.io/badge/SIH%20Auth-Flask%20Authentication-0078D4?style=for-the-badge&logo=flask&logoColor=white)

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)

![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white)
![SMTP](https://img.shields.io/badge/Email-SMTP-EA4335?style=flat-square&logo=gmail&logoColor=white)
![OTP](https://img.shields.io/badge/2FA-OTP-4285F4?style=flat-square&logo=google-authenticator&logoColor=white)
![Sessions](https://img.shields.io/badge/Sessions-Flask-000000?style=flat-square&logo=flask&logoColor=white)
![PBKDF2](https://img.shields.io/badge/Hashing-PBKDF2--SHA256-FF6B6B?style=flat-square&logo=lock&logoColor=white)
![JSON API](https://img.shields.io/badge/API-JSON-000000?style=flat-square&logo=json&logoColor=white)

**A clean, secure Flask backend providing robust authentication with OTP-based 2FA via Email. Perfect for rapid prototyping and production-ready authentication systems.**

[Live Demo](#) • [Report Bug](https://github.com/yourusername/sih-auth-backend/issues/new?template=bug_report.md) • [Request Feature](https://github.com/yourusername/sih-auth-backend/issues/new?template=feature_request.md)

---

## **🌟 Features**

### **Core Authentication**

- **Secure Sign Up** - User registration with PBKDF2-SHA256 password hashing
- **Sign In** - Email and password-based authentication
- **OTP 2FA** - 6-digit time-based OTP with 5-minute expiry
- **Email Delivery** - OTP sent via SMTP (Gmail, SendGrid, etc.)
- **Resend OTP** - Convenient OTP regeneration for users
- **Session Management** - Flask session-based persistent login
- **Protected Routes** - Middleware for authentication-required endpoints

### **Security Features**

- **Password Hashing** - Industry-standard PBKDF2-SHA256 with salt
- **Single-Use OTP** - Each OTP can only be used once
- **Time-Limited OTP** - Auto-expires after 5 minutes
- **Secure Sessions** - Signed cookies with SECRET_KEY
- **Demo Mode** - Console OTP printing when SMTP not configured
- **Zero Setup Database** - SQLite with auto-creation


---


## **📁 Project Structure**

```
sih_auth_backend/
├── app.py                  # Main Flask application
├── models.py               # SQLAlchemy User & OTP models
├── auth.py                 # Authentication logic & routes
├── config.py               # Configuration management
├── utils.py                # Helper functions (OTP, email)
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## **🚀 Quick Start**

### **Prerequisites**

- Python 3.8 or higher
- pip (Python package manager)
- SMTP server credentials (Gmail, SendGrid, etc.) - optional for demo

### **Installation**

```bash
# Extract the project and navigate to directory
cd sih_auth_backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your SECRET_KEY and SMTP credentials
```

### **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Flask Configuration
SECRET_KEY=your_super_secret_key_here_change_in_production
FLASK_ENV=development

# SMTP Email Configuration (Optional - uses console in demo mode)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SENDER_EMAIL=your-email@gmail.com

# Database (Auto-created SQLite by default)
DATABASE_URL=sqlite:///auth.db
```

### **Run the Application**

```bash
# Start Flask development server
python app.py

# Or use Flask CLI
flask run

# Server runs at http://localhost:5000
```

**Database tables are automatically created on first run!**

---

## **🔌 API Endpoints**

### **Public Endpoints**

| **Endpoint** | **Method** | **Description** | **Request Body** |
|--------------|------------|-----------------|------------------|
| `/health` | GET | Health check | - |
| `/signup` | POST | Create new account | `name`, `email`, `password` |
| `/login` | POST | Authenticate & send OTP | `email`, `password` |
| `/verify-otp` | POST | Verify OTP & establish session | `email`, `otp` |
| `/resend-otp` | POST | Resend OTP to email | `email` |
| `/logout` | POST | End user session | - |

---

## **🔐 Security Implementation**

### **Password Security**
- **Algorithm**: PBKDF2-SHA256 with salt
- **Iterations**: 260,000+ rounds
- **Storage**: Hashed passwords only, never plaintext
- **Validation**: Secure comparison using `werkzeug.security`

### **OTP Security**
- **Generation**: Cryptographically secure random 6-digit codes
- **Expiry**: 5-minute time window
- **Single-use**: OTP marked as used after verification
- **Rate limiting**: Recommended for production (see Upgrades)

### **Session Security**
- **Storage**: Server-side Flask sessions
- **Signing**: HMAC-signed cookies with SECRET_KEY
- **HttpOnly**: Cookies not accessible via JavaScript
- **SameSite**: CSRF protection enabled

### **Demo Mode**
When SMTP credentials are not configured:
- OTP printed to console/terminal
- No external email service required
- Perfect for development and testing

---

## **🔧 Configuration**

### **SMTP Email Providers**

#### **Gmail Setup**
1. Enable 2-Step Verification in Google Account
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use App Password in `.env` as `SMTP_PASSWORD`

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
```

#### **SendGrid Setup**
```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## **📊 Testing**

```bash
# Install testing dependencies
pip install pytest pytest-flask

# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

---

## **📚 Dependencies**

```txt
Flask==3.0.0
Flask-Session==0.5.0
Flask-SQLAlchemy==3.0.5
SQLAlchemy==2.0.23
Werkzeug==3.0.1
python-dotenv==1.0.0
```

---

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **🙏 Acknowledgments**

- Flask community for excellent documentation
- Werkzeug team for security utilities
- SQLAlchemy for robust ORM
- Python community for security best practices

---

**Built with 🔐 Sproud**

![GitHub stars](https://img.shields.io/github/stars/yourusername/sih-auth-backend?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/sih-auth-backend?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/sih-auth-backend?style=social)
