# 🎥 TubeMind AI (YouTube & Document Chat)

This project is a modern, full-stack web application that allows users to chat with YouTube transcripts and uploaded documents using Retrieval-Augmented Generation (RAG). 

The application has been upgraded from a single Streamlit script to a **Next.js** frontend and a **FastAPI** backend for a production-ready user experience, scalable architecture, and dynamic UI.

## 🚀 Features

- **YouTube Transcript Processing**: Paste a YouTube URL and instantly interact with its content.
- **Document Chat**: Upload multiple PDF, DOCX, or TXT files.
- **Flexible Knowledge Source**: Choose to chat with YouTube content, your Documents, or Both simultaneously.
- **Modern UI/UX**: Sleek, responsive interface built with Next.js, Tailwind CSS, and Framer Motion for micro-animations.
- **Robust AI Backend**: Powered by FastAPI, LangChain, and FAISS for fast and accurate context retrieval.

## 🧱 Project Structure

```text
youtube-web/
├── backend/          # FastAPI backend (Python)
│   ├── app/          # Core API logic, services, endpoints
│   ├── data/         # Vector store data and uploads storage
│   ├── tests/        # Backend tests
│   ├── requirements.txt
│   └── run.py        # Entry point for the backend server
└── frontend/         # Next.js frontend (React/TypeScript)
    ├── public/       # Static assets
    ├── src/          # Source code (app router, components, UI)
    ├── package.json  # NPM dependencies
    └── eslint/tsconfig configuration
```

## ⚙️ Getting Started

### 1. Backend Setup (FastAPI)

Navigate to the `backend` directory, set up your Python environment, and start the FastAPI server:

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
Create a `.env` file in the `backend/` directory with your necessary API keys (e.g., GROQ_API_KEY):

```env
GROQ_API_KEY=your_groq_api_key
```

**Run the backend:**
```bash
python run.py
```
*The backend API will be running at http://localhost:8000*

### 2. Frontend Setup (Next.js)

Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend

# Install dependencies
npm install
# or yarn install / pnpm install

# Start the development server
npm run dev
```

*Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.*

## 🛠️ Technology Stack

- **Frontend**: Next.js, React 19, Tailwind CSS v4, Framer Motion, TypeScript, Lucide React
- **Backend**: FastAPI, Python, Uvicorn, Pydantic
- **AI / RAG**: LangChain, FAISS (Vector Database), Sentence Transformers, YouTube Transcript API