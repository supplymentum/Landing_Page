# SupplyMentum Landing Page - Backend
## Description

Server-side logic of SupplyMentum Landing Page built over [Nest](https://github.com/nestjs/nest)

## Project setup
### npm configuration
```bash
$ npm install
```

## CMS architecture

The backend includes a modular CMS API built with **NestJS** and **Supabase**. Structured content is managed through dedicated modules, while `cms_sections` remains available for flexible singleton content such as hero sections, mission, vision, contact information, or other page-level content.

### Main CMS modules

The current CMS is organized into the following modules:

* `areas`: manages organization areas.
* `roles`: manages organization roles and hierarchy.
* `executives`: manages directors and organization executives.
* `events`: manages events, registration status, featured events, and summaries.
* `media`: manages image uploads and deletions using Supabase Storage.
* `application`: manages applicant submissions.
* `auth`: manages administrator authentication using JWT.
* `supabase`: provides the shared Supabase client used by the services.

Each feature follows the NestJS structure:

```text
Controller
   ↓
Service
   ↓
SupabaseService
   ↓
Supabase
```

DTOs are used to validate incoming request data before it reaches the service layer.

---

### Supabase database resources

The CMS currently works with the following main tables:

#### `areas`

Stores the organization's areas.

Main fields:

* `area_id`
* `name`
* `short_name`
* `description`
* `image_path`
* `is_active`
* `sort_order`
* `created_at`
* `updated_at`

Inactive areas are kept in the database but are not returned by the public API.

#### `roles`

Stores organization roles independently from executives so new roles can be added without changing backend code.

Main fields:

* `role_id`
* `name`
* `sort_order`
* `is_active`
* `created_at`
* `updated_at`

Examples include:

* Presidente
* Vicepresidente
* Director
* Subdirector

#### `executives`

Stores organization executives and their relationship with roles and areas.

Main fields:

* `executive_id`
* `full_name`
* `role_id`
* `area_id`
* `description`
* `image_path`
* `linkedin_url`
* `is_active`
* `sort_order`
* `created_at`
* `updated_at`

`role_id` references `roles.role_id`.

`area_id` references `areas.area_id` and may be `null`, for example for organization-wide positions such as President.

#### `events`

Stores events displayed on the landing page.

Main fields:

* `event_id`
* `title`
* `description`
* `location`
* `image_path`
* `registration_link`
* `summary_link`
* `start_date_time`
* `is_active`
* `starred`
* `created_at`
* `updated_at`

For events, `is_active` means that registration is currently open.

When `is_active = true`, a `registration_link` is required.

Events are returned in the following order:

1. Featured (`starred`) events.
2. Active events ordered by closest start date.
3. Inactive events ordered from newest to oldest.

---

### Public API

Public endpoints are intended for the landing page and do not require administrator authentication.

Examples:

```text
GET /api/areas
GET /api/areas/:areaId

GET /api/events
GET /api/events/:eventId

GET /api/executives
GET /api/executives/:executiveId
```

Public endpoints return only content that should be visible on the website.

For example, inactive executives and inactive areas are excluded.

---

### Administration API

CMS administration routes are located under:

```text
/api/admin/*
```

and are protected with `JwtAuthGuard`.

Examples:

```text
GET    /api/admin/areas
POST   /api/admin/areas
PATCH  /api/admin/areas/:areaId
DELETE /api/admin/areas/:areaId

GET    /api/admin/roles
POST   /api/admin/roles
PATCH  /api/admin/roles/:roleId
DELETE /api/admin/roles/:roleId

GET    /api/admin/executives
POST   /api/admin/executives
PATCH  /api/admin/executives/:executiveId
DELETE /api/admin/executives/:executiveId

GET    /api/admin/events
POST   /api/admin/events
PATCH  /api/admin/events/:eventId
DELETE /api/admin/events/:eventId
```

Areas, roles, and executives use logical deactivation where appropriate instead of immediately deleting related historical data.

---

### Administrator authentication

Administrator routes are protected using JWT authentication.

Authentication flow:

```text
Admin login
   ↓
Backend validates credentials
   ↓
JWT is generated
   ↓
JWT is stored in the `admin_token` HTTP-only cookie
   ↓
JwtAuthGuard protects `/api/admin/*`
```

Swagger is also configured to document the `admin_token` cookie authentication mechanism.

---

### Media and image management

Images are stored in **Supabase Storage**, not directly inside PostgreSQL.

Create a public bucket named:

```text
cms-media
```

The bucket uses logical folders such as:

```text
cms-media/
├── areas/
├── events/
├── executives/
└── projects/
```

The database stores only the object path:

```text
executives/550e8400-e29b-41d4-a716-446655440000.webp
```

instead of storing the entire public URL.

The backend can generate the public URL from this path when required.

Supported image formats:

```text
image/jpeg
image/png
image/webp
```

Maximum upload size:

```text
5 MB
```

Recommended production images should generally be optimized to considerably less than the maximum size.

Media administration endpoints:

```text
POST   /api/admin/media
DELETE /api/admin/media
```

The upload endpoint receives `multipart/form-data` containing:

```text
file
resource
```

Valid resource values are:

```text
areas
events
executives
projects
```

The backend generates a UUID filename before uploading the file to Storage.

Example result:

```json
{
  "image_path": "executives/550e8400-e29b-41d4-a716-446655440000.webp",
  "image_url": "https://.../storage/v1/object/public/cms-media/executives/550e8400-e29b-41d4-a716-446655440000.webp"
}
```

The returned `image_path` can then be stored when creating or updating the related CMS entity.

---

### Storage security

The `cms-media` bucket is public only because the landing page must be able to display its images.

Public access is intended for reading files only.

Uploads and deletions are performed through the NestJS backend:

```text
CMS frontend
   ↓
JWT-protected NestJS API
   ↓
MediaService
   ↓
Supabase service role
   ↓
Supabase Storage
```

No public `INSERT`, `UPDATE`, or `DELETE` Storage policies should be required for the CMS workflow.

The Supabase service role key must remain exclusively in the backend environment and must never be exposed to frontend code.

---


### Swagger

API documentation is available at:

```text
http://localhost:3001/docs
```

The backend API uses the global prefix:

```text
/api
```

Recommended local development configuration:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
API:      http://localhost:3001/api
Swagger:  http://localhost:3001/docs
```


### Environment variables
1. Create a .env file based on .env.example
2. Complete the following:
    * `SUPABASE_URL`: Public url for Supabase connection
    * `SUPABASE_KEY`: Database's public anon key
    * `JWT_SECRET`: A large random hexadecimal string. You can generate one using crypto in your command line:
    ```bash
   $ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.