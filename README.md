# MindCare 🧠💙

**"Your sanctuary for mental wellness and professional care."**

MindCare is a comprehensive, full-stack mental health platform designed to bridge the gap between individuals seeking mental wellness and licensed psychologists. The platform features an integrated AI assistant powered by Google Gemini, tailored specifically for the unique needs of both patients and mental health professionals.

---

## ✨ Key Features

### 🔐 Dual-Role Authentication & Architecture
- Secure, JWT-based authentication system.
- Distinct, tailored dashboard experiences for **Patients** and **Psychologists**.

### 🤖 AI-Powered Assistant (Google Gemini 2.5 Flash)
MindCare features a context-aware AI chatbot that adapts based on the user's role:
- **For Patients:** Acts as a compassionate, empathetic assistant focusing on stress management, anxiety relief, emotional wellbeing, and mindfulness. Includes built-in safety rails to advise contacting emergency services during severe distress.
- **For Psychologists:** Acts as a clinical AI assistant providing session preparation help, evidence-based resources, clinical note suggestions, and productivity support.

### 📅 Meeting Management
- Schedule, track, and manage appointments between patients and psychologists.
- Add session notes and automated notifications upon meeting scheduling.

### 👤 Comprehensive User Profiles
- Upload and manage custom profile avatars.
- Maintain bios, contact details, and (for psychologists) specialized fields of practice.

### 📈 Tracking & Analytics
- Track mood, mental health requests, and platform analytics to monitor emotional well-being over time.

---

## 🛠️ Technology Stack

### Backend (API)
- **Framework:** Python / FastAPI
- **Database:** SQLite (`mindcare.db`)
- **ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens) via `python-jose`
- **Security:** Password hashing using `passlib` (PBKDF2-SHA256)
- **AI Integration:** Google GenAI SDK

### Frontend (UI)
- **Core:** Vanilla JavaScript, HTML5
- **Styling:** Tailwind CSS
- **Architecture:** Single Page Application (SPA) feel with dynamic DOM rendering (`login.js`, etc.)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm (for potential frontend dependencies/Tailwind build process)

### 1. Environment Setup
Create a `.env` file in the root directory and add the following required variables:

```env
PROJECT_NAME="MindCare API"
SECRET_KEY="your_super_secret_key_here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL="sqlite:///./mindcare.db"
GEMINI_API_KEY="your_google_gemini_api_key_here"
```
*(Note: Ensure your `.env` file is never committed to version control!)*

### 2. Backend Setup
Navigate to the `backend` directory and set up your Python environment:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if necessary)
python upgrade_db.py

# Start the FastAPI server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Serve the frontend directory using any local web server. For example, using Python's built-in `http.server`:

```bash
cd frontend
python -m http.server 8000
```
Navigate to `http://localhost:8000` in your web browser to access the application.

---

## 🧪 Testing
You can test the Gemini API integration locally using the provided test script:
```bash
python backend/test_gemini.py
```

*MindCare - Built with ❤️ for mental health awareness.*