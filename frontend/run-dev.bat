@echo off
cd /d "%~dp0"
echo Iniciando frontend (Next.js) en http://localhost:3000 ...
call npm run dev
pause
