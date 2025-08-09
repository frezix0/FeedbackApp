@echo off
echo Starting Feedback App...
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo 🚀 Feedback App is starting...
echo.
echo 📊 Backend: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo.
echo ⏳ Please wait for both servers to fully start...
echo ========================================
