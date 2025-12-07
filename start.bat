@echo off
echo Starting Construction Mini ERP & Finance System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d \"%~dp0backend\" && npm run dev"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
pause
