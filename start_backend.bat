@echo off
echo ========================================================
echo Starting AgriShift OS FastAPI Backend on http://localhost:8000
echo ========================================================
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause

