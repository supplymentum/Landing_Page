# Plan de Trabajo - Administrador (Admin)

## Fase 1
* **Encargado:** Joaquin Berrospi

### 1. Autenticación e Inicio de Sesión (Login)
* **Requerimiento:** Permitir que los administradores inicien sesión de forma segura para acceder al panel de control.
* **Descripción de la tarea:**
  - Creación del endpoint de autenticación y login (`POST /api/admin/login`).
  - Validación de credenciales (nombre de usuario y contraseña cifrada) contra los registros de la base de datos.
  - Generación de un token JWT tras el login exitoso, el cual es guardado del lado del cliente mediante una cookie segura (`admin_token`) con configuración HTTP-only, SameSite strict y tiempo de expiración (2 horas).

### 2. Panel de Control (Dashboard)
* **Requerimiento:** Disponer de una sección segura que dé la bienvenida al administrador una vez autenticado.
* **Descripción de la tarea:**
  - Creación del endpoint protegido del dashboard (`GET /api/admin/dashboard`).
  - Implementación de un mecanismo de seguridad (Guardia) que verifica que la cookie del token JWT sea válida y no haya expirado para otorgar el acceso.

### 3. Visualización de Candidatos (Postulantes)
* **Requerimiento:** Permitir que el administrador consulte el listado de personas que se han postulado a través del formulario de la landing page.
* **Descripción de la tarea:**
  - Creación del endpoint protegido (`GET /api/admin/applicants`).
  - Conexión con el servicio de base de datos para recuperar la lista de candidatos con sus datos principales (nombre, apellido, correo electrónico, teléfono, carrera, semestre, áreas de interés seleccionadas, fecha de postulación y el motivo por el cual postulan).

### 4. Cierre de sesión (Logout)

* **Requerimiento:** Permitir el cierre de sesión de admin
* **Descripción de la tarea:**
  - Creación del endpoint protegido del dashboard (`POST /api/admin/logout`).
  - Implementación del mecanismo de eliminación de la cookie una vez hecha la solicitud.