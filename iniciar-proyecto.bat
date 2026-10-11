@echo off
setlocal

echo ============================================
echo   SupplyMentum - Iniciar proyecto
echo ============================================
echo.

REM --- Verifica que exista el .env del backend ---
if not exist "%~dp0backend\.env" (
    echo [AVISO] No se encontro backend\.env
    echo Copia backend\.env.example a backend\.env y completa las credenciales
    echo de Supabase, JWT_SECRET, etc. antes de continuar.
    echo.
    pause
    exit /b 1
)

REM --- Verifica que exista el .env.local del frontend ---
if not exist "%~dp0frontend\.env.local" (
    echo [AVISO] No se encontro frontend\.env.local
    echo Copia frontend\.env.example a frontend\.env.local y completa
    echo NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo ^(el login con Google no funcionara sin esto^).
    echo.
    pause
)

echo [1/4] Instalando dependencias del backend...
call npm install --prefix "%~dp0backend"
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la instalacion de dependencias del backend.
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias del frontend...
call npm install --prefix "%~dp0frontend"
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la instalacion de dependencias del frontend.
    pause
    exit /b 1
)

echo.
echo [3/4] Iniciando backend en http://localhost:3001 ...
start "SupplyMentum - Backend" "%~dp0backend\run-dev.bat"

echo [4/4] Iniciando frontend en http://localhost:3000 ...
start "SupplyMentum - Frontend" "%~dp0frontend\run-dev.bat"

echo.
echo ============================================
echo   Listo. Se abrieron dos ventanas:
echo     - Backend  (NestJS)  -^> http://localhost:3001/api
echo     - Frontend (Next.js) -^> http://localhost:3000
echo   Cierra esas ventanas para detener los servidores.
echo ============================================
echo.
pause

endlocal
