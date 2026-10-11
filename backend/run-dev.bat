@echo off
cd /d "%~dp0"
echo Iniciando backend (NestJS) en http://localhost:3001 ...
call npm run start:dev
pause
