# Detalles de Implementación - Administrador (Admin)

## Fase 1

* **Encargado:** Joaquin Berrospi

El módulo de administración y autenticación se encuentra desarrollado en NestJS y está dividido en dos directorios principales: `src/admin` y `src/auth`. Se conecta a una base de datos PostgreSQL gestionada mediante Supabase.

### 1. Controladores y Rutas

#### [AdminController](../../src/admin/admin.controller.ts)
Maneja las peticiones HTTP destinadas al panel administrativo bajo el prefijo `/api/admin`.
* **`POST /api/admin/login`**:
  - Recibe un JSON en el cuerpo con `{ username, password }`.
  - Invoca a `AuthService.login(username, password)`.
  - Configura la cookie de respuesta HTTP `admin_token` con el JWT firmado. Parámetros de la cookie:
    - `httpOnly: true` (Previene accesos por scripts maliciosos de JS).
    - `secure: true` (Solo en producción mediante verificación de variable de entorno).
    - `sameSite: 'strict'` (Mitigación ante ataques CSRF).
    - `maxAge: 2 * 60 * 60 * 1000` (Vigencia de 2 horas).
* **`GET /api/admin/dashboard`**:
  - Ruta protegida con el guardia `JwtAuthGuard`.
  - Retorna un objeto simple con un mensaje de bienvenida.
* **`GET /api/admin/applicants`**:
  - Ruta protegida con el guardia `JwtAuthGuard`.
  - Invoca a `AdminService.getApplicants()` para obtener el listado.
* **`POST /api/admin/logout`**:
  - Ruta protegida con el guardia `JwtAuthGuard`.
  - Cierra la sesión actual de admin.

### 2. Servicios de Negocio

#### [AdminService](../../src/admin/admin.service.ts)
* **`getApplicants()`**:
  - Inicializa el cliente Supabase a través del servicio de infraestructura `SupabaseService`.
  - Ejecuta una consulta sobre la tabla `applicants` seleccionando los campos: `first_name`, `last_name`, `email`, `phone`, `career`, `university_semester`, `first_choice_area_id`, `second_choice_area_id`, `application_reason`, `created_at`.
  - Retorna la lista resultante de postulantes.

### 3. Autenticación y Seguridad (Módulo Auth)

#### [AuthService](../../src/auth/auth.service.ts)
* **`login(username, password)`**:
  - Busca al administrador en la tabla `admins` de Supabase usando el username provisto.
  - Si no existe el administrador, lanza `UnauthorizedException`.
  - Compara la contraseña en texto plano enviada por el usuario con el hash almacenado (`password_hash`) usando `bcrypt.compare`.
  - Si la contraseña es inválida, lanza `UnauthorizedException`.
  - Si las credenciales coinciden, genera y firma un token JWT que contiene el ID de administrador (`sub`), su `username` y su rol (`admin`).

#### [JwtStrategy](../../src/auth/strategies/jwt.strategy.ts)
* Extiende de `PassportStrategy(Strategy)`.
* Extrae el token JWT directamente de las cookies de la petición HTTP buscando el nombre `admin_token`.
* Valida la firma del token utilizando la clave secreta `JWT_SECRET`.
* Método `validate(payload)`: Inyecta en el objeto `request.user` el ID (`userId`), `username` y `role` decodificados del JWT.

#### [JwtAuthGuard](../../src/auth/jwt-auth.guard.ts)
* Extiende de `AuthGuard('jwt')`.
* Guardia que restringe las rutas exclusivamente a peticiones que contengan un JWT válido y no expirado dentro de las cookies.

#### [AuthModule](../../src/auth/auth.module.ts)
* Configura de forma asíncrona el `JwtModule` inyectando `ConfigService`.
* Establece que los tokens JWT expiren en `2h` por defecto para coordinarse con la expiración de la cookie del navegador.
