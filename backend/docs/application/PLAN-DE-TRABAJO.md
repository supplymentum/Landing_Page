# Plan de Trabajo - Postulaciones (Application)

## Fase 1
* **Encargado:** Joaquin Berrospi

### 1. Obtención de Áreas de Postulación
* **Requerimiento:** Permitir al frontend listar las distintas áreas de especialización académica/laboral del negocio para que el candidato pueda elegir su primera y segunda preferencia.
* **Descripción de la tarea:**
  - Creación del endpoint público (`GET /api/application/areas`).
  - Consulta y ordenamiento de las áreas disponibles en el sistema para mostrarlas en el formulario de la landing page.

### 2. Envío de Formulario de Postulación
* **Requerimiento:** Permitir que los postulantes se registren ingresando su información básica, académica y su carta de motivación.
* **Descripción de la tarea:**
  - Creación del endpoint público para registrar una nueva postulación (`POST /api/application`).
  - Validación automatizada de los datos de entrada para asegurar que contengan un formato correcto (por ejemplo, correos electrónicos válidos, números de teléfono adecuados, semestre de universidad, etc.).
  - Implementación de reglas lógicas de negocio al momento del registro, tales como:
    - Asegurar que la primera opción de área y la segunda opción de área elegidas por el postulante no sean idénticas.
    - Validar que las áreas seleccionadas existan activamente en el catálogo de áreas.
  - Inserción y almacenamiento definitivo de la postulación en la base de datos para la posterior revisión de los administradores.
