@echo off
REM GMGN Termux Bot - One-Click Setup for Windows

setlocal enabledelayedexpansion

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Node.js not found!
    echo Please install from nodejs.org
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  🚀 GMGN Termux Bot - Setup             ║
echo ╚════════════════════════════════════════╝
echo.

set "REPO_PATH=%USERPROFILE%\gmgn-termux-bot"

if exist "%REPO_PATH%" (
    echo Repository exists. Updating...
    cd /d "%REPO_PATH%"
    git pull origin main
) else (
    echo Cloning repository...
    git clone https://github.com/steam899/gmgn-termux-bot.git "%REPO_PATH%"
    cd /d "%REPO_PATH%"
)

echo.
echo Installing dependencies...
call npm install

if not exist ".env" (
    echo.
    set /p API_KEY="Enter GMGN_API_KEY (from https://gmgn.ai/ai): "
    
    echo GMGN_API_KEY=%API_KEY% > .env
    echo BOT_ENABLED=true >> .env
    echo UPDATE_INTERVAL=60000 >> .env
    echo DASHBOARD_PORT=3000 >> .env
    
    echo [OK] .env file created
)

if not exist "logs" mkdir logs

echo.
echo ╔════════════════════════════════════════╗
echo ║    ✅ Setup Complete!                   ║
echo ╚════════════════════════════════════════╝
echo.
echo Next step: npm start
echo.
pause