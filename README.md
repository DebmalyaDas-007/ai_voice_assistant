# AI Mock Interview Platform

An AI-powered mock interview system that simulates real technical interviews using voice interaction. The platform dynamically generates interview questions, listens to spoken answers, adapts difficulty, and produces structured feedback after the interview.

## Features

* **Voice-based interview** using the Web Speech API (speech recognition and text-to-speech)
* **Adaptive AI questioning** based on candidate responses
* **Structured evaluation report** with scores and qualitative feedback
* **Fast session management** using Redis
* **RESTful backend** built with FastAPI
* **Modern frontend** built with React and Vite

## Tech Stack

**Backend**

* FastAPI
* Hugging Face models (via LangChain)
* Redis (session storage)
* Python

**Frontend**

* React
* Vite
* Web Speech API (SpeechRecognition & SpeechSynthesis)

## Architecture

```
React Frontend
      │
      ▼
FastAPI Backend
      │
      ├─ AI Question & Evaluation Generation (HuggingFace / LangChain)
      └─ Redis Session Storage
```

## Project Structure

```
backend/
 ├─ app/
 │   ├─ ai/            # prompts, chains, LLM setup
 │   ├─ controllers/   # API controllers
 │   ├─ services/      # interview and evaluation logic
 │   ├─ routes/        # API routes
 │   ├─ schemas/       # request/response models
 │   └─ core/          # Redis client
 └─ main.py

frontend/
 └─ src/
     ├─ pages/         # Landing, Interview, Evaluation
     ├─ api/           # API calls
     └─ components/
```

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/ai-mock-interview.git
cd ai-mock-interview
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Ensure Redis is running:

```bash
redis-server
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

Backend API docs:

```
http://127.0.0.1:8000/docs
```

## Interview Flow

1. User provides a job description and difficulty level
2. AI generates and speaks the first interview question
3. Candidate answers via voice or text
4. AI adapts follow-up questions based on responses
5. After completion, the system generates an evaluation report

## Example Evaluation Output

```json
{
  "status": "finished",
  "evaluation": {
    "confidence": 30,
    "knowledge": 40,
    "communication_skills": 30,
    "problem_solving": 20,
    "strengths": ["Has some experience with Python"],
    "weaknesses": ["Lacks detailed understanding of Python data structures"],
    "areas_to_improve": ["Coding practice and problem solving skills"],
    "final_recommendation": "No Hire"
  }
}
```

## Future Improvements

* Performance visualization using charts
* Persistent database storage
* User authentication and interview history
* Multi-language interview support

## License

MIT License
