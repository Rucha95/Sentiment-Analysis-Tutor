# Grandma's Story Sentiment Explorer (React + FastAPI)

It's a web app that teaches **Sentiment Analysis** to kids using an animated story
between a **grandmother** and **granddaughter**, plus a live **rule-based** analyzer and an **alternative**
simpler model. Includes a short quiz.

## Tech
- **Frontend:** React (Vite), responsive (mobile / tablet / laptop), accessible labels, smooth UX.
- **Backend:** FastAPI with CORS. 

## Run Locally

### 1) Start API
```bash
cd backend
./run.sh
# or on Windows:
# python -m venv .venv
# .venv\Scripts\activate
# pip install -r requirements.txt
# uvicorn app:app --reload --port 8000
```

### 2) Start Frontend
Open a new terminal:
```bash
cd frontend
npm i
npm run dev
```
Visit http://localhost:5173

> The frontend expects the API at `http://localhost:8000`. To change, set `VITE_API_URL`:
```bash
VITE_API_URL=http://localhost:8001 npm run dev
```
