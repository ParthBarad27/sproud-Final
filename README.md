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

## **🏗️ Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                        │
│              (Web, Mobile, Desktop, etc.)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         JSON API
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Flask Backend                             │
│         Authentication Logic + Session Management           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              SQLite Database + SMTP Server                   │
│           User Data Storage + OTP Email Delivery            │
└─────────────────────────────────────────────────────────────┘
```

---

## **🛠️ Tech Stack**

| **Layer** | **Technologies** |
|-----------|------------------|
| **Backend** | Flask 3.0, Python 3.8+ |
| **Database** | SQLite 3, SQLAlchemy 2.0 |
| **Authentication** | Flask-Session, PBKDF2-SHA256 |
| **Email** | SMTP (Gmail, SendGrid, etc.) |
| **Security** | Werkzeug Security, Secrets module |
| **API** | RESTful JSON endpoints |

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

### **Protected Endpoints**

| **Endpoint** | **Method** | **Description** | **Auth Required** |
|--------------|------------|-----------------|-------------------|
| `/protected` | GET | Example protected route | Yes (Session) |

---

## **📝 API Usage Examples**

### **1. Sign Up**

```bash
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd"
}

# Response (200 OK)
{
  "message": "Account created successfully"
}
```

### **2. Sign In (Generates OTP)**

```bash
POST /login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd"
}

# Response (200 OK)
{
  "message": "OTP sent to your email",
  "expires_in": "5 minutes"
}
```

### **3. Verify OTP**

```bash
POST /verify-otp
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "123456"
}

# Response (200 OK)
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### **4. Resend OTP**

```bash
POST /resend-otp
Content-Type: application/json

{
  "email": "john.doe@example.com"
}

# Response (200 OK)
{
  "message": "New OTP sent to your email"
}
```

### **5. Access Protected Route**

```bash
GET /protected
Cookie: session=<session_cookie>

# Response (200 OK)
{
  "message": "Welcome to protected area",
  "user": {
    "id": 1,
    "email": "john.doe@example.com"
  }
}
```

### **6. Logout**

```bash
POST /logout

# Response (200 OK)
{
  "message": "Logged out successfully"
}
```

---

## **💾 Database Schema**

### **User Model**
```python
{
  id: Integer (Primary Key),
  name: String(100),
  email: String(120) - Unique,
  password_hash: String(256),
  created_at: DateTime,
  is_verified: Boolean
}
```

### **OTP Model**
```python
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key),
  otp_code: String(6),
  created_at: DateTime,
  expires_at: DateTime,
  is_used: Boolean
}
```

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

#### **Other Providers**
- **Outlook/Hotmail**: `smtp.office365.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Amazon SES**: `email-smtp.region.amazonaws.com:587`

---

## **⚡ Optional Upgrades**

### **Recommended Production Enhancements**

1. **Rate Limiting**
   ```bash
   pip install Flask-Limiter
   ```
   - Limit login attempts (5 per 15 minutes)
   - Limit OTP requests (3 per 5 minutes)
   - Prevent brute-force attacks

2. **OTP Attempt Tracking**
   - Lock account after 5 failed OTP attempts
   - Implement cooldown period (30 minutes)
   - Send email alerts for suspicious activity

3. **JWT for Mobile Clients**
   ```bash
   pip install PyJWT
   ```
   - Replace sessions with stateless tokens
   - Better for mobile/SPA applications
   - Include refresh token mechanism

4. **HTML Email Templates**
   - Professional branded emails
   - Responsive design for mobile
   - Include company logo and styling

5. **PostgreSQL/MySQL Migration**
   ```bash
   pip install psycopg2-binary  # PostgreSQL
   pip install PyMySQL           # MySQL
   ```
   - Better performance for production
   - Advanced features and scalability

6. **Frontend Integration**
   - React/Vue.js SPA
   - HTML forms with Flask templates
   - Mobile app (React Native, Flutter)

7. **Logging & Monitoring**
   - Structured logging with `python-json-logger`
   - Error tracking (Sentry)
   - Analytics (Mixpanel, Amplitude)

8. **Two-Factor Backup Codes**
   - Generate 10 single-use backup codes
   - Store hashed in database
   - Use when OTP unavailable

---

## **🐛 Troubleshooting**

### **Common Issues**

#### **1. SMTP Authentication Failed**
```
SMTPAuthenticationError: Username and Password not accepted
```
**Solution**:
- Gmail: Use App Password, not account password
- Enable "Less secure app access" (not recommended) or use App Password
- Check SMTP server and port are correct

#### **2. OTP Not Received**
**Solution**:
- Check spam/junk folder
- Verify SMTP credentials in `.env`
- Check console output in demo mode
- Ensure email address is valid

#### **3. Database Locked Error**
```
sqlite3.OperationalError: database is locked
```
**Solution**:
- SQLite doesn't support concurrent writes well
- Migrate to PostgreSQL/MySQL for production
- Reduce database operations in parallel requests

#### **4. Session Not Persisting**
**Solution**:
- Ensure `SECRET_KEY` is set in `.env`
- Check cookies are enabled in browser
- Verify session middleware is configured
- Use secure HTTPS in production

#### **5. OTP Expired**
**Solution**:
- OTP valid for 5 minutes only
- Use `/resend-otp` endpoint to get new OTP
- Consider extending expiry to 10 minutes if needed

---

## **🚀 Deployment**

### **Production Checklist**

- [ ] Set strong `SECRET_KEY` (use `secrets.token_hex(32)`)
- [ ] Configure production SMTP provider
- [ ] Migrate to PostgreSQL/MySQL
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Set `FLASK_ENV=production`
- [ ] Implement rate limiting
- [ ] Add logging and error tracking
- [ ] Set up database backups
- [ ] Configure CORS for frontend
- [ ] Add health monitoring
- [ ] Document API with Swagger/OpenAPI

### **Deployment Platforms**

- **Heroku**: Easy Flask deployment with PostgreSQL addon
- **Railway**: Modern platform with automatic HTTPS
- **Render**: Free tier with persistent storage
- **DigitalOcean App Platform**: Scalable with managed databases
- **AWS Elastic Beanstalk**: Enterprise-grade with full control
- **Google Cloud Run**: Serverless with automatic scaling

---

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

## **📞 Support**

- 📧 Create an issue for bugs or questions
- 💬 Check existing issues before creating new ones
- ⭐ Star this repo if you find it useful!
- 🔔 Watch for updates and releases

---

**Built with 🔐 Sproud**

![GitHub stars](https://img.shields.io/github/stars/yourusername/sih-auth-backend?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/sih-auth-backend?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/sih-auth-backend?style=social)
