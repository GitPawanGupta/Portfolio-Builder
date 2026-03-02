@echo off
echo ========================================
echo Portfolio Builder - Installation
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed!
echo.

echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed!
echo.

echo [3/3] Seeding Database...
cd backend
call npm run seed
if errorlevel 1 (
    echo WARNING: Database seeding failed. You may need to run it manually.
)
cd ..
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Run start.bat to start the application
echo.
echo Or manually:
echo   Backend:  cd backend  ^&^& npm run dev
echo   Frontend: cd frontend ^&^& npm run dev
echo.
pause
