# 🎥 TubeMind AI (Enterprise Application)

TubeMind AI is an enterprise-grade, full-stack web application that allows users to chat with YouTube transcripts and documents using Advanced Retrieval-Augmented Generation (RAG). 

The platform has been rebuilt from a lightweight prototype into a production-ready system featuring a **Next.js** frontend and a **FastAPI** backend with a **PostgreSQL** database and robust Clean Architecture.

## 🚀 Features

- **Robust Authentication:** Secure JWT-based signup and login system.
- **YouTube Transcript Processing:** Intelligent AI chat based on video transcripts.
- **Web Search Fallback:** Automatically scrapes the web if a YouTube transcript is unavailable.
- **AI Recommendation Engine:** Generates highly relevant YouTube video recommendations utilizing LangChain and LLMs.
- **Modern UI/UX:** Sleek, responsive interface built with Next.js, Tailwind CSS, and Framer Motion.
- **Scalable Backend:** Powered by FastAPI, SQLAlchemy (Async), Alembic, and PostgreSQL.

## 🧱 Project Structure (Clean Architecture)

```text
TubeMind-AI/
├── backend/          # FastAPI backend (Python)
│   ├── alembic/      # Database migrations
│   ├── app/          
│   │   ├── api/          # API Routers, Middleware, Dependencies
│   │   ├── core/         # Settings, Security, Database config
│   │   ├── models/       # SQLAlchemy DB Models (UUID, Soft Deletes)
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── repositories/ # CRUD operations abstraction
│   │   ├── services/     # AI logic, YouTube Fetching, RAG
│   │   ├── chatbot/      # Chat management
│   │   ├── recommendation/ # Recommendation logic
│   │   ├── embeddings/   # FAISS Vector Store logic
│   │   └── main.py       # Application entry point
│   └── requirements.txt
│
└── frontend/         # Next.js frontend (React/TypeScript)
    └── src/
        ├── app/          # Next.js App Router pages
        ├── components/   # Reusable UI components
        ├── features/     # Feature-specific logic
        ├── services/     # API clients
        ├── hooks/        # React hooks
        └── context/      # Global state
```

## ⚙️ Getting Started

### 1. Database Setup (PostgreSQL)

You will need a local instance of **PostgreSQL** running.
Create a database named `tubemind`.

Default credentials configured in the system:
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### 2. Backend Setup (FastAPI)

Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend/` directory with your necessary API keys:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=super_secret_production_key_here
```

**Run Database Migrations:**
Initialize the PostgreSQL database tables using Alembic:
```bash
alembic upgrade head
```

**Run the Backend Server:**
```bash
uvicorn app.main:app --reload
```
*The backend API will be running at http://localhost:8000*

### 3. Frontend Setup (Next.js)

Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

*Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.*

## 🛠️ Technology Stack

<<<<<<< HEAD
- **Frontend**: React 19, Tailwind CSS v4, Lucide React
- **Backend**: FastAPI, Python, Uvicorn, Pydantic
- **AI / RAG**: LangChain, FAISS (Vector Database), Sentence Transformers, YouTube Transcript API
=======
- **Frontend**: Next.js, React 19, Tailwind CSS v4, Framer Motion, TypeScript
- **Backend**: FastAPI, Python, Uvicorn, Pydantic, Passlib, python-jose
- **Database / ORM**: PostgreSQL, SQLAlchemy 2.0 (asyncpg), Alembic
- **AI / RAG**: LangChain, FAISS (Vector Database), Sentence Transformers, YouTube Transcript API
>>>>>>> 83098c1 (chore: update README and frontend changes)
