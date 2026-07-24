# 🎥 TubeMind AI

> **An enterprise-grade, full-stack AI platform to intelligently interact with YouTube transcripts and documents.**

![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

TubeMind AI transforms the way you learn and gather information from YouTube videos. It leverages Advanced Retrieval-Augmented Generation (RAG) to let you chat with video transcripts, discover related content, and even fallback to web searches when transcripts are unavailable.

## ✨ Key Features

- 🔐 **Secure Authentication**: Robust JWT-based signup and login system.
- 💬 **Intelligent YouTube Chat**: Ask questions and get answers directly from video transcripts using RAG.
- 🌐 **Smart Web Fallback**: Automatically searches the web if a video lacks a transcript.
- 🎯 **AI Recommendations**: Get highly relevant video recommendations powered by LangChain and LLMs.
- 🎨 **Modern Interface**: A sleek, responsive, and dynamic UI built with Next.js, Tailwind CSS v4, and Framer Motion.
- ⚡ **Scalable Architecture**: A high-performance FastAPI backend with PostgreSQL, adhering to Clean Architecture principles.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (React 19)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM & Migrations**: SQLAlchemy 2.0 (asyncpg), Alembic
- **Security**: Passlib, python-jose (JWT)

### AI & Machine Learning
- **Orchestration**: LangChain
- **Vector Store**: FAISS
- **Embeddings**: Sentence Transformers
- **Data Source**: YouTube Transcript API

## 📂 Project Structure

```text
TubeMind-AI/
├── backend/                  # FastAPI Backend
│   ├── alembic/              # Database migrations
│   ├── app/          
│   │   ├── api/              # API Routers & Endpoints
│   │   ├── core/             # Configuration & Security settings
│   │   ├── models/           # SQLAlchemy DB Models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── repositories/     # Database operations
│   │   ├── services/         # Core business logic (AI, RAG, YouTube)
│   │   └── main.py           # Application Entry Point
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # Next.js Frontend
    ├── src/
    │   ├── app/              # Next.js App Router pages
    │   ├── components/       # Reusable React components
    │   ├── services/         # API clients
    │   └── ...               # Hooks, context, and features
    ├── package.json          # Node dependencies
    └── tailwind.config.ts    # Tailwind configuration
```

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** running locally (Create a database named `tubemind`)

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables**
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_super_secret_key
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/tubemind
```

**Initialize Database**
```bash
alembic upgrade head
```

**Run the Server**
```bash
uvicorn app.main:app --reload
```
*API will be available at `http://localhost:8000`*

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*Frontend will be available at `http://localhost:3000`*

## 📜 License

This project is licensed under the MIT License.
