# Cómo correr el proyecto SupplyMentum

Guía paso a paso para clonar y levantar el proyecto en una máquina nueva.

## 1. Instala las herramientas necesarias

- **Git** (Windows, x64): https://git-scm.com/
- **Node.js** (Windows installer): https://nodejs.org/es/download
- **VS Code** (Windows x64) o el IDE de tu preferencia: https://code.visualstudio.com/download

## 2. Clona el repositorio

Ve a tu carpeta de Documentos en el Explorador de archivos, haz clic derecho y elige **"Open Git Bash here"**. Ahí ejecuta:

```bash
git clone https://github.com/devrenato56/SupplyMentum-Landing-Page.git
```

## 3. Abre el proyecto en VS Code

Presiona `Win + R`, escribe `cmd` y dale Enter para abrir una terminal. Luego:

```cmd
cd Documents\supplymentum-landing-page
code .
```

El último comando abre el proyecto directamente en VS Code.

## 4. Configura las variables de entorno

### Frontend

Dentro de la carpeta `frontend`, clic derecho → **New File** → nómbralo `.env.local`. Pega este contenido y guarda con `Ctrl + S`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hrmhechruvmjojlenxwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybWhlY2hydXZtam9qbGVueHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMzQxNzksImV4cCI6MjA5OTkxMDE3OX0.EpV2h6gx9Baczd4tEgTEvCWITR7hrBHpteoGIC8QG6M
```

### Backend

Dentro de la carpeta `backend`, clic derecho → **New File** → nómbralo `.env`. Pega este contenido y guarda con `Ctrl + S`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://hrmhechruvmjojlenxwg.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybWhlY2hydXZtam9qbGVueHdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDMzNDE3OSwiZXhwIjoyMDk5OTEwMTc5fQ.iVTrj0GDr7CwotZQ5-fTbfN515JnIc93-6upwnWB-f8
JWT_SECRET=qfU8DmU1ER+ANYyraEydRUJpX59fgouB7HD5BnngeGnr/r7LeaWRGM4f6AKbv368Jak4vhuxFTFFoip4ErVAtQ==
```

> ⚠️ Estas credenciales dan acceso completo al proyecto de Supabase (la `SUPABASE_KEY` es la *service role*, que salta todas las reglas de seguridad). No las subas a GitHub ni las compartas fuera del equipo.

## 5. Corre el proyecto

Abre la terminal integrada de VS Code con `` Ctrl + ` `` (o `Ctrl + Ñ` en teclado en español) y ejecuta:

```cmd
iniciar-proyecto.bat
```

Esto instala las dependencias de `backend` y `frontend`, y abre dos ventanas: una con el backend (`http://localhost:3001`) y otra con el frontend (`http://localhost:3000`).

## 6. Accede al panel de administración

Entra a:

```
http://localhost:3000/admin
```

- **Usuario:** `admin`
- **Contraseña:** `admin123`

> Cambia esta contraseña una vez dentro; es una cuenta de prueba.

## 7. Prueba el sistema

Recorre el sitio público y el panel admin, y avisa si algo no funciona como se espera.
