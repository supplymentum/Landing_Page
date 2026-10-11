## 1. Introducción

## 1.1 Propósito

El presente documento tiene como propósito definir de manera clara, ordenada y completa los requisitos funcionales, no funcionales y de los *stakeholders* necesarios para el diseño y desarrollo de la **Landing Page de SupplyMentum UNI**, comunidad universitaria enfocada en la gestión de la cadena de suministro.

El proyecto busca centralizar en un solo espacio digital la cultura, identidad y esencia del centro, resaltando qué es SupplyMentum, cuál es su propósito dentro de la Universidad Nacional de Ingeniería (UNI), qué actividades desarrolla y cuál es su misión y visión.

Este documento de **Especificación de Requisitos de Software (SRS)** servirá como guía técnica para el equipo de desarrollo y como documento de referencia y acuerdo entre los distintos interesados (*stakeholders*) del proyecto.

---

## 1.2 Alcance

La **Landing Page de SupplyMentum UNI** será un sitio web de navegación por secciones (*single-page* con anclas y/o subpáginas por sección), con una fuerte carga de elementos visuales, animados e interactivos en el frontend.

La única excepción será la sección **Convocatoria**, la cual contará además con lógica de backend para la gestión del estado de la convocatoria, así como para el procesamiento, almacenamiento y administración de las postulaciones.

### Secciones del sistema

El sistema comprenderá las siguientes secciones:

- **Home**
  - Página de bienvenida.
  - Logo 3D animado.
  - Presentación del centro.
  - Métricas.
  - Novedades.
  - Ramas de especialización.
  - Llamado a la acción para postular.

- **Áreas**
  - Presentación de las áreas o comités que conforman la agrupación.
  - Distribución en una corona circular interactiva.
  - Página propia para cada área.

- **Conócenos**
  - Presentación institucional.
  - Misión.
  - Presentación de los miembros de la junta directiva.

- **Proyectos**
  - Exhibición de proyectos desarrollados o en curso.
  - Proyectos destacados.
  - Catálogo completo de proyectos.

- **Eventos**
  - Difusión de eventos próximos y pasados.
  - Buscador.
  - Filtros.
  - Preguntas frecuentes (FAQ).

- **Convocatoria**
  - Estado de la convocatoria (habilitada/deshabilitada).
  - Cuenta regresiva.
  - Formulario de postulación.
  - Almacenamiento de postulaciones.
  - Gestión mediante panel administrativo.

---

### Dentro del alcance del proyecto

El desarrollo contempla:

- Diseño e implementación de las seis secciones descritas.
- Implementación de animaciones e interacciones, incluyendo:
  - Logo 3D.
  - Carruseles.
  - Corona circular.
  - Cinta transportadora.
  - Ventanas emergentes (*pop-ups*).
  - Acordeón para preguntas frecuentes.
  - Buscador.
  - Filtros.
- Formulario de postulación funcional con validación tanto en frontend como en backend.
- Visualización del formulario únicamente cuando la convocatoria se encuentre habilitada.
- Almacenamiento de postulaciones en una base de datos.
- Panel administrativo para:
  - Revisar postulaciones.
  - Gestionar postulaciones.
  - Configurar el estado de la convocatoria.
  - Definir la fecha de cierre de la convocatoria.
- Envío automático de un correo electrónico de confirmación al postulante.
- Integración de enlaces externos hacia los perfiles de LinkedIn de:
  - Directores de área.
  - Miembros de la junta directiva.

---

### Fuera del alcance del proyecto

No forma parte del alcance del sistema:

- Pasarelas de pago o cualquier tipo de transacción económica.
- Sistema de autenticación o creación de cuentas para el público general (únicamente el panel administrativo requerirá autenticación).
- Blog, foro o sistema de comentarios.
- Aplicación móvil nativa.
- Soporte para múltiples idiomas, salvo que sea definido como un requisito futuro.
- Sistema de gestión de contenidos (CMS) con interfaz visual para editar el contenido de las secciones **Home**, **Áreas**, **Proyectos** y **Eventos**. Salvo que se especifique lo contrario en futuras versiones, dicho contenido será actualizado directamente desde el código fuente o los archivos de datos del sitio.

## 1.3 Contexto Institucional

La siguiente información institucional constituye el contenido base que será utilizado en la sección **Conócenos** de la Landing Page de **SupplyMentum UNI**.

### ¿Quiénes somos?

Somos una comunidad universitaria que impulsa el desarrollo académico y profesional de estudiantes en la gestión de la cadena de suministro. Aprendemos juntos, compartimos experiencias y crecemos de forma colaborativa, más allá de las aulas.

### Misión

Brindar formación aplicada y accesible para fortalecer competencias técnicas y estratégicas, mediante programas innovadores y metodologías prácticas.

### Visión

Ser la comunidad universitaria líder en **Supply Chain** en el Perú, reconocida por su excelencia, innovación y por inspirar a los futuros profesionales a transformar el mundo empresarial.

## 2. Descripción General

### 2.1 Restricciones
*   **Recursos Limitados:** El proyecto será desarrollado por integrantes de la propia agrupación estudiantil, con recursos de tiempo y personal limitados.
*   **Alcance del Backend:** El backend se limita exclusivamente al módulo de **Convocatoria** (gestión del estado/fecha de la convocatoria, recepción, almacenamiento y gestión de postulaciones); el resto del sitio corresponde a contenido de *frontend*.
*   **Stack Tecnológico:** No se define un stack tecnológico específico en este documento; queda a criterio del equipo de desarrollo, respetando las buenas prácticas y los requisitos aquí descritos.
*   **Rendimiento y Animaciones:** Los elementos animados o tridimensionales (logo 3D animado, corona circular de áreas, cinta transportadora de proyectos, carruseles) requieren tecnologías de renderizado y animación (por ejemplo, librerías 3D/WebGL y de animación CSS/JS) que deben implementarse cuidando el rendimiento en dispositivos de gama media.
*   **Identidad Visual:** El diseño visual debe respetar obligatoriamente la paleta cromática y la tipografía institucional definidas por **SupplyMentum** (ver sección 2.4.4).
*   **Compatibilidad:** El sistema debe funcionar sobre navegadores web estándar, sin requerir instalación de software adicional por parte del usuario.
*   **Gestión de Contenido:** El contenido de *'Home'*, *'Áreas'*, *'Proyectos'* y *'Eventos'* (textos, imágenes, métricas, perfiles de LinkedIn) será proporcionado y actualizado por los miembros de SupplyMentum.

---

### 2.2 Funcionalidades Principales
*   **Home:** Presentación del centro con logo 3D animado, métricas, novedades, especializaciones y llamado a la acción (CTA).
*   **Estructura de Áreas:** Visualización de las áreas o comités que conforman SupplyMentum, con una página propia por cada área y enlaces a LinkedIn.
*   **Presentación Institucional:** Misión de la organización y presentación de la junta directiva con enlaces a sus respectivos perfiles de LinkedIn.
*   **Catálogo de Proyectos:** Exhibición de proyectos realizados o en curso, organizados en formato destacado y catálogo completo.
*   **Sección de Eventos:** Difusión de eventos próximos y pasados, con herramientas de búsqueda, filtrado por categoría y sección de preguntas frecuentes (FAQ).
*   **Módulo de Convocatoria:** 
    *   Visualización del estado de la convocatoria (habilitada/deshabilitada) con cuenta regresiva.
    *   Formulario de postulación con validación de datos en tiempo real.
    *   Almacenamiento de postulaciones en base de datos mediante una API.
    *   Envío automático de correo electrónico de confirmación al postulante.
*   **Panel Administrativo:** Panel protegido para la gestión, seguimiento de postulaciones y configuración del estado/fechas de la convocatoria.
*   **Sistema de Gestión de Contenido (CMS):** Herramienta para la modificación y publicación de contenido dinámico (actualización de miembros de la junta, eventos recientes, información de áreas, imágenes, etc.).

### 2.3.4 Identidad Visual: Paleta Cromática y Tipografía

De acuerdo con los lineamientos de marca proporcionados por **SupplyMentum**, la interfaz del sistema debe respetar la siguiente paleta de colores y tipografía. Estos elementos constituyen requisitos no funcionales de diseño (ver *RNF-11* y *RNF-12*).

#### Colores Primarios
*Colores principales a usar en cualquier material digital o físico de SupplyMentum.*

| ID | Color | Código HEX | Uso Sugerido |
| :---: | :--- | :---: | :--- |
| **A** | Rojo Primario | `#ED1C24` | Color principal de marca, títulos destacados, botones de acción. |
| **B** | Rojo Oscuro | `#920207` | Textos destacados, encabezados secundarios, fondos oscuros. |
| **C** | Ámbar / Dorado | `#FFBD59` | Acentos, íconos, elementos decorativos. |

#### Colores Secundarios
*Colores que acompañan a los principales, de uso referencial.*

| ID | Color | Código HEX | Uso Sugerido |
| :---: | :--- | :---: | :--- |
| **a** | Negro | `#000000` | Textos de cuerpo, fondos oscuros. |
| **b** | Rojo Secundario | `#E13526` | Variación de acento, elementos de apoyo. |
| **c** | Dorado Claro | `#FED775` | Fondos suaves, elementos decorativos. |
| **d** | Blanco | `#FFFFFF` | Fondos, tipografía sobre colores oscuros. |

> 💡 **Nota:** En muchas ocasiones se usarán imágenes como fondo para el contenido; en esos casos, los colores de la paleta se utilizarán únicamente en los elementos decorativos o en la tipografía, respetando el contraste y la legibilidad.

#### Tipografía

| Uso | Fuentes Sugeridas |
| :--- | :--- |
| **Títulos y Subtítulos** | `Archivo Black`, `Poppins`, `Anton` *(o variaciones/fuentes similares)* |
| **Cuerpo de Texto** | `Open Sans`, `PT Sans`, `Montserrat` *(en distintos pesos, incluyendo Bold para subtítulos según el contexto)* |

---

## 3. Requisitos Específicos

## 3.1 Requisitos Funcionales (RF)
Los requisitos funcionales se agrupan según los módulos identificados en el sistema. La columna **Prioridad** indica la importancia relativa del requisito para el lanzamiento inicial del producto.

### 3.1.1 Módulo: Home
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-01** | El sistema debe mostrar un *Hero Section* en el Home con el logo de SupplyMentum en 3D animado, rotando, y una *tagline* referente al centro alineada a la derecha, con un botón "Conócenos" debajo de la descripción. | **Alta** |
| **RF-02** | El sistema debe mostrar una sección con descripción breve del centro, detallando de manera general lo que hace, acompañada de fotos representativas. | **Alta** |
| **RF-03** | El sistema debe mostrar una sección de métricas del centro con los números logrados durante su tiempo de existencia. | **Media** |
| **RF-04** | El sistema debe mostrar una sección de novedades con los eventos, charlas y talleres más recientes organizados por SupplyMentum, distribuidos en formato de carrusel. | **Alta** |
| **RF-05** | El sistema debe mostrar una sección sobre las ramas de especialización del centro, con el logo de SupplyMentum animado, de modo que cada cierto intervalo de animación se muestre una especialización distinta junto con su descripción. | **Media** |
| **RF-06** | El sistema debe mostrar una sección con los motivos para unirse a SupplyMentum y lo que ganaría el usuario al unirse, incluyendo un botón "Únete a nosotros" o "Postula aquí" (con una potencial mascota como elemento visual). | **Alta** |
| **RF-07** | El sistema debe mostrar una sección de tarjetas (*cards*) con las pestañas de la landing page, de forma que al presionar una tarjeta, el usuario sea redirigido a la sección correspondiente. | **Alta** |

### 3.1.2 Módulo: Áreas
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-08** | El sistema debe mostrar las áreas como círculos distribuidos a lo largo de una corona circular, cada uno con una breve descripción, permitiendo al usuario acceder a cada área. | **Alta** |
| **RF-09.1** | En la página de cada área individual, el sistema debe mostrar una *Hero Section* con un *tagline* identificador del área y un logotipo que la identifique. | **Alta** |
| **RF-09.2** | El sistema debe mostrar, dentro de la página del área, una sección que indique qué busca el área en los postulantes (requisitos del área). | **Alta** |
| **RF-09.3** | El sistema debe mostrar en la página del área los enlaces a los perfiles de LinkedIn de los directores del área. | **Media** |
| **RF-09.4** | Al finalizar la página del área, el sistema debe preguntar al usuario si le interesa el área y, de ser así, mostrar un botón de postulación que lo invite a verificar si la convocatoria está habilitada. | **Alta** |

### 3.1.3 Módulo: Conócenos
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-10** | El sistema debe mostrar, en la sección Conócenos, la misión del centro en un *tagline* dentro de una *Hero Section* con una imagen referente al centro. | **Alta** |
| **RF-11** | El sistema debe mostrar a todos los miembros de la junta de SupplyMentum UNI dispuestos simétricamente en círculos clickeables, con su foto, que permitan el acceso al perfil de LinkedIn correspondiente. | **Alta** |

### 3.1.4 Módulo: Proyectos
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-12** | El sistema debe mostrar, en una *Hero Section*, los proyectos más importantes del centro dentro de cajas dispuestas a lo largo de una cinta transportadora animada; al hacer clic sobre una caja, se debe mostrar el proyecto. | **Alta** |
| **RF-13** | El sistema debe mostrar una sección con el catálogo completo de proyectos de SupplyMentum, distribuidos en formato de almacén (*racks*), con cada proyecto representado como una caja. | **Media** |
| **RF-14.1** | Al presionar una caja de proyecto, el sistema debe mostrar un pop-up emergente con la información correspondiente a dicho proyecto. | **Alta** |

### 3.1.5 Módulo: Eventos
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-15** | El sistema debe mostrar los eventos de SupplyMentum UNI, desde los más recientes hasta los próximos y los pasados. | **Alta** |
| **RF-16** | El sistema debe mostrar en la cabecera (*Hero*) de la sección Eventos estadísticas de impacto, como la cantidad de eventos realizados, número de asistentes y beneficios generados. | **Media** |
| **RF-17** | El sistema debe mostrar las actividades futuras (próximos eventos) en formato de tarjetas, cada una con fecha de inicio, título, descripción breve, hora y ubicación (física o virtual). | **Alta** |
| **RF-18** | El sistema debe proveer una barra de búsqueda por texto que permita al usuario encontrar eventos realizados específicos mediante palabras clave. | **Media** |
| **RF-19** | El sistema debe permitir filtrar la cuadrícula de eventos realizados mediante etiquetas o categorías predefinidas (`Todos`, `Charlas`, `Talleres`, `Workshops`, `Conferencias`). | **Media** |
| **RF-20** | El sistema debe presentar el historial de eventos realizados en formato de cuadrícula de tarjetas, mostrando portada, fecha, título y una breve descripción de lo tratado. | **Alta** |
| **RF-21** | El sistema debe mostrar una sección de preguntas frecuentes (FAQ) con comportamiento de acordeón, de modo que al hacer clic en una pregunta se expanda la respuesta correspondiente. | **Baja** |

### 3.1.6 Módulo: Convocatoria — Frontend
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-22** | El sistema debe mostrar, en la sección Convocatoria, un carrusel con las letras de las áreas combinado con una *Hero Section* con una imagen representativa del centro, indicando la fecha de finalización y un contador regresivo si la convocatoria está habilitada; si no está habilitada, la sección se debe mostrar en color plomo. | **Alta** |
| **RF-23** | El sistema debe mostrar el formulario de postulación, accesible desde los botones "Postula aquí" / "Únete a nosotros" del Home y de cada Área, únicamente cuando la convocatoria esté habilitada. | **Alta** |
| **RF-24** | El sistema debe validar en el frontend que todos los campos obligatorios del formulario estén completos antes de permitir el envío. | **Alta** |
| **RF-25** | El sistema debe validar el formato del correo electrónico ingresado en el formulario. | **Alta** |
| **RF-26** | El sistema debe mostrar un mensaje de confirmación visual cuando la postulación se envía correctamente. | **Alta** |
| **RF-27** | El sistema debe mostrar un mensaje de error claro si el envío del formulario falla. | **Media** |

### 3.1.7 Módulo: Convocatoria — Backend y Panel Administrativo
| ID | Descripción | Prioridad |
| :---: | :--- | :---: |
| **RF-28** | El backend debe recibir los datos del formulario de Convocatoria mediante una API y almacenarlos en la base de datos. | **Alta** |
| **RF-29** | El sistema debe validar en el servidor (*server-side*) que los datos recibidos sean correctos y completos. | **Alta** |
| **RF-30** | El sistema debe enviar automáticamente un correo de confirmación de recepción al postulante. | **Media** |
| **RF-31** | El sistema debe contar con un panel administrativo protegido mediante autenticación para el equipo de SupplyMentum. | **Alta** |
| **RF-32** | El panel administrativo debe permitir listar todas las postulaciones recibidas, con filtros básicos (por estado y/o fecha). | **Alta** |
| **RF-33** | El panel administrativo debe permitir actualizar el estado de una postulación (Pendiente, Aceptado, Rechazado). | **Alta** |
| **RF-34** | El sistema debe restringir el acceso al panel administrativo únicamente a usuarios autorizados por SupplyMentum. | **Alta** |
| **RF-35** | El panel administrativo debe permitir configurar el estado (habilitada/deshabilitada) y la fecha de cierre de la convocatoria, reflejándose en el contador regresivo de la sección Convocatoria (RF-22). | **Alta** |
| **RF-36** | El panel administrativo debe incluir un historial de cambios en donde se pueda ver las modificaciones más recientes que se realizaron en el panel de administración. | **Media** |

---

## 3.2 Requisitos No Funcionales (RNF)
Los requisitos no funcionales describen las cualidades y restricciones con las que debe cumplir el sistema, incluyendo aspectos de usabilidad, rendimiento, seguridad e identidad visual.

| ID | Categoría | Descripción |
| :---: | :--- | :--- |
| **RNF-01** | Usabilidad | La interfaz debe ser intuitiva, permitiendo a cualquier visitante navegar entre 'Áreas', 'Conócenos', 'Proyectos', 'Eventos' y 'Convocatoria' sin instrucciones previas. |
| **RNF-02** | Usabilidad | El diseño debe ser *responsive*, adaptándose correctamente a dispositivos móviles, tablets y escritorio. |
| **RNF-03** | Rendimiento | Las secciones de contenido estático (Áreas, Conócenos, Proyectos, Eventos) deben cargar en menos de 3 segundos en una conexión estándar. |
| **RNF-04** | Rendimiento | El backend debe procesar y responder una solicitud de postulación en menos de 2 segundos bajo condiciones normales de operación. |
| **RNF-05** | Seguridad | Los datos personales de los postulantes deben almacenarse de forma segura, evitando su exposición pública. |
| **RNF-06** | Seguridad | El acceso al panel administrativo debe estar protegido mediante autenticación (usuario y contraseña, o mecanismo equivalente). |
| **RNF-07** | Seguridad | La comunicación entre el frontend y el backend debe realizarse mediante el protocolo HTTPS. |
| **RNF-08** | Disponibilidad | El sitio debe estar disponible al menos el 99% del tiempo, salvo ventanas de mantenimiento programado. |
| **RNF-09** | Compatibilidad | El sitio debe visualizarse correctamente en los navegadores modernos más usados (Chrome, Firefox, Edge, Safari). |
| **RNF-10** | Mantenibilidad | El código debe estar organizado y mínimamente documentado, de forma que futuros integrantes de SupplyMentum puedan darle mantenimiento. |
| **RNF-11** | Identidad visual | La interfaz debe respetar estrictamente la paleta cromática oficial de SupplyMentum (ver sección 2.3.4). |
| **RNF-12** | Identidad visual | La interfaz debe respetar la tipografía oficial definida para títulos y cuerpo de texto (ver sección 2.3.4). |
| **RNF-13** | Rendimiento | El logo 3D animado y las animaciones de la interfaz (corona circular de Áreas, cinta transportadora de Proyectos, carruseles del Home) deben optimizarse para no degradar significativamente el rendimiento en dispositivos de gama media. |
| **RNF-14** | Usabilidad / Acc. | El sistema debe procurar que las animaciones no dificulten la lectura del contenido ni la navegación, ofreciendo alternativas estáticas o pausables cuando sea razonable para usuarios sensibles al movimiento. |
| **RNF-15** | Rendimiento | La búsqueda y el filtrado de eventos deben devolver resultados de forma prácticamente instantánea (percibida por el usuario en menos de 1 segundo) para catálogos de tamaño moderado. |
| **RNF-16** | Compatibilidad | Los componentes con renderizado 3D deben contar con una alternativa visual (imagen estática o animación 2D) en navegadores o dispositivos que no soporten aceleración gráfica (WebGL). |

---

## 3.3 Requisitos de Stakeholders (RS)
Los requisitos de stakeholders reflejan las necesidades y expectativas de los distintos grupos de interés involucrados en el proyecto.

| ID | Stakeholder | Requisito |
| :---: | :--- | :--- |
| **RS-01** | Junta Directiva de SupplyMentum | Requiere que la landing page refleje fielmente la identidad visual de la marca y proyecte una imagen profesional que atraiga a nuevos postulantes. |
| **RS-02** | Equipo de Convocatorias / Reclutamiento | Requiere un panel administrativo sencillo, sin necesidad de conocimientos técnicos avanzados, para revisar y gestionar las postulaciones recibidas. |
| **RS-03** | Estudiantes postulantes | Requieren un formulario de postulación simple, rápido de completar, y con una confirmación clara de que su postulación fue recibida correctamente. |
| **RS-04** | Visitantes / público general | Requieren poder conocer de forma rápida y clara qué es SupplyMentum, sus áreas, proyectos y eventos, sin necesidad de crear una cuenta. |
| **RS-05** | Equipo de desarrollo y mantenimiento | Requiere que el sistema cuente con documentación y una estructura clara (como este SRS) que facilite futuras actualizaciones o el traspaso del proyecto a nuevas generaciones. |