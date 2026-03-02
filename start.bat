@echo off
echo ========================================
echo Portfolio Builder - Starting Application
echo ========================================
echo.

echo [1/4] Checking MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: MongoDB is not installed or not in PATH
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo MongoDB found!
echo.

echo [2/4] Starting MongoDB...
start "MongoDB" mongod
timeout /t 3 >nul
echo.

echo [3/4] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..
echo.

echo [4/4] Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..
echo.

echo ========================================
echo Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/login
echo.
echo Default Admin Credentials:
echo Email:    admin@pasuai.online
echo Password: admin123
echo.
echo Press any key to exit this window...
pause >nul
