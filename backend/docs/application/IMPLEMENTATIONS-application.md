# Detalles de Implementación - Postulaciones (Application)

## Fase 1

* **Encargado:** Joaquin Berrospi

El módulo de postulación para los candidatos está ubicado en `src/application`, y se apoya en el módulo de infraestructura de `src/supabase` para comunicarse con la base de datos PostgreSQL.

### 1. Controladores y Rutas

#### [ApplicationController](../../src/application/application.controller.ts)
Maneja las peticiones HTTP públicas de los usuarios que visitan la Landing Page bajo el prefijo `/api/application`.
* **`GET /api/application/areas`**:
  - Petición pública.
  - Llama a `ApplicationService.listAreas()` para traer las opciones a mostrar en los selectores del formulario de postulación.
* **`POST /api/application`**:
  - Petición pública.
  - Recibe los datos de la postulación mapeados al DTO de entrada.
  - Llama a `ApplicationService.sendApplication(applicationDto)`.

### 2. Validación de Datos (DTO)

#### [ApplicationDto](../../src/application/dto/application.dto.ts)
Estructura de datos que valida la entrada mediante decoradores de `class-validator`:
* **`first_name`**: Tipo string, no vacío.
* **`last_name`**: Tipo string, no vacío.
* **`email`**: Tipo string, no vacío.
* **`phone`**: Tipo string, no vacío.
* **`career`**: Tipo string, no vacío.
* **`university_semester`**: Tipo número, no vacío.
* **`first_choice_area_id`**: Tipo número (ID de área), no vacío.
* **`second_choice_area_id`**: Tipo número (ID de área), no vacío.
* **`application_reason`**: Tipo string (carta de motivación), no vacío.

### 3. Servicios de Negocio

#### [ApplicationService](../../src/application/application.service.ts)
Implementa las reglas y consultas correspondientes al registro de candidatos.
* **`listAreas()`**:
  - Obtiene el cliente de Supabase.
  - Consulta la tabla `areas`, seleccionando `area_id` y `name`.
  - Ordena los resultados ascendentemente por `area_id`.
* **`sendApplication(dto)`**:
  - **Regla de negocio 1 (Áreas Distintas)**: Verifica que `first_choice_area_id` sea diferente de `second_choice_area_id`. Si son iguales, lanza un `BadRequestException`.
  - **Regla de negocio 2 (Existencia de Área 1)**: Consulta la tabla `areas` por el ID especificado en la primera opción. Si retorna un error PostgREST con código `'PGRST116'` (sin filas retornadas), lanza un `NotFoundException` indicando que el área no existe.
  - **Regla de negocio 3 (Existencia de Área 2)**: Realiza la misma validación de existencia para la segunda opción de área. Si no existe, lanza un `NotFoundException`.
  - **Inserción**: Si se superan las validaciones, inserta los datos de `ApplicationDto` en la tabla `applicants` de Supabase, obteniendo la respuesta insertada a través de `.select().single()`. Retorna el objeto creado o lanza un `InternalServerErrorException` en caso de fallo en la base de datos.

### 4. Infraestructura de Base de Datos

#### [SupabaseService](../../src/supabase/supabase.service.ts)
* Proveedor de servicio global que inicializa el cliente oficial de Supabase (`@supabase/supabase-js`).
* Obtiene las credenciales del entorno (`SUPABASE_URL` y `SUPABASE_KEY`) mediante el `ConfigService` de NestJS.
* Expone el método `getClient()` para que los demás módulos interactúen de forma centralizada con la base de datos.
