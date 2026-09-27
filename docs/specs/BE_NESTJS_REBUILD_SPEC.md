# Đặc tả tái xây dựng Backend bằng NestJS

## 1. Mục đích tài liệu

Tài liệu này là đặc tả nghiệp vụ, dữ liệu và API để xây lại backend portfolio **180 Studio** bằng NestJS, TypeScript và PostgreSQL. Nó thay thế nhu cầu đọc lại backend Express cũ và là nguồn hợp đồng cho `FE_NEXTJS_REBUILD_SPEC.md`.

Phạm vi:

- Public content API: logo, slideshow trang chủ, dự án, chi tiết dự án, About.
- Xác thực admin bằng access/refresh token trong cookie.
- API admin quản lý media, logo, slideshow, About và dự án.
- Schema PostgreSQL mục tiêu, transaction, validation, bảo mật, migration, test và vận hành.

Nguồn khảo sát: toàn bộ `Architecture/backend`, toàn bộ nơi frontend gọi API và metadata schema PostgreSQL thực tế. Việc kiểm tra database chỉ đọc cấu trúc/constraint, không đọc dữ liệu khách hàng.

## 2. Nghiệp vụ hiện có

Hệ thống là một CMS nhỏ cho portfolio kiến trúc:

- Khách không cần tài khoản để xem nội dung.
- Admin đăng nhập bằng email/password; hiện chỉ có role `admin`.
- Logo và hồ sơ About là singleton.
- Trang chủ là danh sách poster/slide theo thứ tự.
- Dự án được sắp xếp theo `priority ASC`.
- Mỗi dự án gồm:
  - tên và ảnh bìa dùng ở listing;
  - một bản thông tin chi tiết;
  - danh sách ảnh gallery;
  - metadata năm, địa điểm, diện tích, khách hàng, nhiếp ảnh gia;
  - tiêu đề/nội dung ý tưởng bằng tiếng Anh và tiếng Việt.
- Xóa project phải xóa detail và gallery liên quan.

## 3. Kiến trúc mục tiêu

Khuyến nghị dùng NestJS theo module, PostgreSQL và Prisma ORM. Có thể thay Prisma bằng TypeORM nếu đội dự án thống nhất, nhưng schema, transaction và API trong tài liệu phải giữ nguyên.

```text
src/
  main.ts
  app.module.ts
  config/
    env.validation.ts
    app.config.ts
  common/
    decorators/current-user.decorator.ts
    filters/http-exception.filter.ts
    guards/access-token.guard.ts
    guards/roles.guard.ts
    guards/origin.guard.ts
    interceptors/response.interceptor.ts
    pipes/parse-positive-int.pipe.ts
    types/api-response.ts
  database/
    database.module.ts
    prisma.service.ts
  auth/
    auth.controller.ts
    auth.service.ts
    auth.module.ts
    dto/login.dto.ts
    strategies/access-token.strategy.ts
    strategies/refresh-token.strategy.ts
  users/
    users.service.ts
    users.module.ts
  site/
    public-site.controller.ts
    admin-site.controller.ts
    site.service.ts
    dto/
  projects/
    public-projects.controller.ts
    admin-projects.controller.ts
    projects.service.ts
    dto/
  media/
    admin-media.controller.ts
    media.service.ts
    cloudinary.provider.ts
  health/
    health.controller.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
test/
```

> **Cập nhật 2026-09-27:** Mỗi feature được tổ chức theo `src/modules/<feature>/{domain,application,infrastructure,presentation}` (Clean/Hexagonal/DDD), xem `directives/architecture.md`. Home slides nằm ở `src/modules/home/` thay vì `site/`. Cây thư mục trên chỉ còn là gợi ý phân chia trách nhiệm; route và contract ở §8 không đổi.

Quy tắc ranh giới:

- Controller chỉ parse request/response và gọi service.
- Service giữ nghiệp vụ và transaction.
- ORM/repository giữ truy cập dữ liệu; không viết SQL rải trong controller.
- DTO đầu vào không dùng chung với entity trả về.
- Public controller không phụ thuộc guard admin.
- Mọi route dưới `/api/v1/admin` dùng access-token guard + role guard `admin` + bảo vệ CSRF/origin cho mutation.

## 4. Schema PostgreSQL hiện tại đã xác nhận

Schema cũ có 7 bảng:

### `about_us`

| Cột | Kiểu | Null | Ghi chú |
|---|---|---|---|
| `id` | integer | no | PK, sequence |
| `avatar` | text | yes | URL ảnh |
| `name` | varchar | yes | |
| `education` | text | yes | |
| `skill` | text | yes | |
| `experience` | text | yes | |
| `bio` | text | yes | |
| `email` | varchar | yes | |
| `phone_studio` | varchar | yes | |
| `phone` | varchar | yes | |
| `website` | varchar | yes | |
| `address` | text | yes | |

Code luôn update `WHERE id = 1`; UI lại đọc thêm `title` nhưng DB không có cột này.

### `admin_auth`

| Cột | Kiểu | Null | Ghi chú |
|---|---|---|---|
| `id` | integer | no | PK |
| `email` | text | no | unique |
| `password_hash` | text | no | bcrypt |
| `role` | varchar | yes | thực tế là `admin` |
| `created_at` | timestamp | yes | default current timestamp |
| `updated_at` | timestamp | yes | default current timestamp |
| `refresh_token` | text | yes | đang lưu plaintext, một token/user |

### `app_logo`

`id integer PK`, `url text NOT NULL`; code dùng record `id = 1`.

### `poster`

`id integer PK`, `url text NOT NULL`; public đọc `ORDER BY id ASC`.

### `project`

`id integer PK`, `name varchar NOT NULL`, `image_poster text NULL`, `priority integer NULL`; public đọc `ORDER BY priority ASC`.

### `detail_project`

| Cột | Kiểu | Null |
|---|---|---|
| `id` | integer PK | no |
| `id_project` | integer FK → `project.id` ON DELETE CASCADE | no |
| `name_project` | varchar | no |
| `text_english` | text | yes |
| `text_vn` | text | yes |
| `year` | integer | yes |
| `location` | varchar | yes |
| `site_area` | varchar | yes |
| `floor_area` | varchar | yes |
| `client` | varchar | yes |
| `photographer` | varchar | yes |
| `idea_eng` | text | yes |
| `idea_vie` | text | yes |

Constraint năm hiện tại: `year >= 1900 AND year <= current year`. DB chưa có unique constraint trên `id_project`, dù nghiệp vụ chỉ dùng một detail/project.

### `project_image`

`id integer PK`, `id_project integer NOT NULL FK → project.id ON DELETE CASCADE`, `url text NOT NULL`. Không có cột thứ tự; hiện phụ thuộc ngầm vào thứ tự insert/DB.

Schema hiện tại chỉ có index PK/unique email, chưa có index riêng cho foreign key, priority hoặc refresh token.

## 5. Schema mục tiêu

Tên vật lý có thể map bằng ORM, nhưng model logic và constraint phải tương đương dưới đây.

### 5.1 `admin_users`

| Cột | Kiểu | Quy tắc |
|---|---|---|
| `id` | bigint identity | PK |
| `email` | varchar(320) | not null, unique, lưu lowercase |
| `password_hash` | text | not null, bcrypt/argon2 hash |
| `role` | varchar(32) | not null, check `admin` |
| `created_at` | timestamptz | not null, default now |
| `updated_at` | timestamptz | not null, auto update |

### 5.2 `refresh_sessions`

| Cột | Kiểu | Quy tắc |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | bigint | FK admin_users, cascade |
| `token_hash` | char(64) | not null, unique; chỉ lưu SHA-256 của token |
| `expires_at` | timestamptz | not null |
| `revoked_at` | timestamptz | nullable |
| `created_at` | timestamptz | default now |
| `user_agent` | text | nullable |
| `ip_address` | inet/text | nullable |

Tách session cho phép nhiều thiết bị và rotate/revoke an toàn; không mang `refresh_token` plaintext cũ sang.

### 5.3 `site_settings`

Singleton `id = 1`:

- `id smallint PK CHECK (id = 1)`
- `logo_url text NOT NULL`
- `logo_public_id text NULL`
- `updated_at timestamptz NOT NULL`

### 5.4 `about_profiles`

Singleton `id = 1`:

- `id smallint PK CHECK (id = 1)`
- `avatar_url`, `avatar_public_id` nullable
- `name varchar(255) NOT NULL DEFAULT ''`
- `title varchar(255) NULL`
- `education`, `skills`, `experience`, `bio` text not null default empty string
- `email varchar(320) NOT NULL DEFAULT ''`
- `studio_phone`, `personal_phone`, `website`, `address` text not null default empty string
- `updated_at timestamptz NOT NULL`

### 5.5 `home_slides`

- `id bigint identity PK`
- `image_url text NOT NULL`
- `image_public_id text NULL`
- `alt_text varchar(500) NULL`
- `position integer NOT NULL CHECK (position >= 0)`
- `created_at`, `updated_at timestamptz NOT NULL`
- index `(position, id)`
- nên có unique deferrable `(position)` hoặc service phải normalize position nguyên tử

### 5.6 `projects`

- `id bigint identity PK`
- `name varchar(255) NOT NULL`
- `cover_image_url text NOT NULL`
- `cover_image_public_id text NULL`
- `priority integer NOT NULL DEFAULT 0 CHECK (priority >= 0)`
- `created_at`, `updated_at timestamptz NOT NULL`
- index `(priority, id)`

Không thêm draft/published vì source cũ không có nghiệp vụ publish. Nếu cần sau này phải là yêu cầu riêng.

### 5.7 `project_details`

- `project_id bigint PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE`
- `display_name varchar(255) NOT NULL`
- `description_en text NOT NULL DEFAULT ''`
- `description_vi text NOT NULL DEFAULT ''`
- `year integer NOT NULL`, service kiểm tra `1900..current year`
- `location`, `site_area`, `floor_area`, `client`, `photographer` varchar/text not null
- `idea_title_en`, `idea_title_vi` text nullable

Dùng `project_id` làm PK để DB đảm bảo quan hệ one-to-one.

### 5.8 `project_images`

- `id bigint identity PK`
- `project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE`
- `image_url text NOT NULL`
- `image_public_id text NULL`
- `alt_text varchar(500) NULL`
- `position integer NOT NULL CHECK (position >= 0)`
- `created_at timestamptz NOT NULL`
- index `(project_id, position, id)`
- unique deferrable `(project_id, position)` hoặc normalize trong transaction

## 6. Quy tắc nghiệp vụ mục tiêu

### 6.1 Singleton content

- Logo và About luôn thao tác record `id = 1` bằng upsert.
- Seed phải tạo hai record singleton ban đầu.
- Public logo chỉ trả một object, không trả mảng một phần tử.

### 6.2 Home slides

- Public sort `position ASC, id ASC`.
- Thêm slide không có position thì append cuối.
- Xóa/reorder phải normalize lại vị trí liên tục từ 0.
- URL ảnh bắt buộc; số slide có thể bằng 0.

### 6.3 Projects

- Public sort `priority ASC, id ASC`.
- Tạo mới yêu cầu: tên listing, ảnh bìa, tên detail, năm, location, site/floor area, client, photographer, mô tả EN/VI và 1–4 ảnh gallery.
- Hai tiêu đề ý tưởng EN/VI là tùy chọn để tương thích dữ liệu cũ.
- `year` là số nguyên 1900 đến năm hiện tại.
- Trim chuỗi; không chấp nhận URL rỗng hoặc phần tử gallery rỗng.
- `priority` không cần unique; `id` là tie-breaker.
- Create ghi project, detail và images trong **một transaction**. Bất kỳ bước nào lỗi phải rollback toàn bộ.
- Update giữ nguyên project ID. Nếu payload có `images`, coi đó là danh sách gallery thay thế toàn bộ và ghi lại position trong cùng transaction.
- Delete dựa vào FK cascade cho detail/images; trả `404` nếu project không tồn tại.
- Reorder nhiều project trong một transaction.

### 6.4 Media

- Chỉ admin được upload.
- Cho phép JPEG, PNG, WebP và tùy chọn AVIF; kiểm tra cả MIME lẫn magic bytes.
- Giới hạn kích thước qua env, khuyến nghị mặc định 15 MB/file.
- Phân folder theo purpose: logo, avatar, home slides, project cover, project gallery.
- API trả URL HTTPS và `publicId`.
- Không xóa asset Cloudinary trước khi transaction DB thành công. Nếu xóa cloud thất bại sau commit, ghi job retry/log để tránh làm hỏng dữ liệu DB.
- File upload thành công nhưng entity submit thất bại có thể thành orphan; cần cleanup định kỳ hoặc cơ chế temporary asset nếu lưu lượng tăng.

## 7. Chuẩn response và lỗi

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "uuid"
  }
}
```

Failure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "fields": {
      "year": ["Năm không được lớn hơn năm hiện tại"]
    }
  },
  "requestId": "uuid"
}
```

Mã lỗi tối thiểu:

- `VALIDATION_ERROR` → 400
- `INVALID_CREDENTIALS` → 401
- `UNAUTHENTICATED` → 401
- `FORBIDDEN` → 403
- `CSRF_ORIGIN_REJECTED` → 403
- `RESOURCE_NOT_FOUND` → 404
- `CONFLICT` → 409
- `PAYLOAD_TOO_LARGE` → 413
- `UNSUPPORTED_MEDIA` → 422
- `RATE_LIMITED` → 429
- `INTERNAL_ERROR` → 500

Không trả stack, SQL, JWT error hoặc chi tiết Cloudinary cho client.

## 8. API contract đầy đủ

Base path: `/api/v1`.

### 8.1 Public site

#### `GET /site/logo`

- `200`: `data = { url, publicId? }`.
- Singleton chưa cấu hình: ưu tiên seed logo fallback; nếu không có thì `404` rõ ràng.

#### `GET /site/home-slides`

- `200`: `data = HomeSlide[]`, sort theo position.
- Không có slide trả mảng rỗng, không trả 404.

#### `GET /about`

- `200`: một `AboutProfile`, không phải array.
- Mapping từ DB snake_case sang JSON camelCase.

### 8.2 Public projects

#### `GET /projects`

`200`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "House A",
      "coverImage": { "url": "https://...", "publicId": "..." },
      "priority": 0
    }
  ]
}
```

Portfolio hiện nhỏ nên endpoint trả toàn bộ. Khi bổ sung pagination phải giữ mặc định tương thích với FE.

#### `GET /projects/:id`

- Validate `id` là integer dương.
- Một query có include/join hoặc transaction read trả project + detail + images.
- Gallery sort `position ASC, id ASC`.
- `404` nếu project hoặc detail không tồn tại.

Response `data`:

```json
{
  "id": 1,
  "name": "Listing name",
  "coverImage": { "url": "https://..." },
  "priority": 0,
  "displayName": "Detail name",
  "year": 2025,
  "location": "Ho Chi Minh City",
  "siteArea": "120 m²",
  "floorArea": "300 m²",
  "client": "Private client",
  "photographer": "Photographer",
  "ideaTitleEn": "Idea",
  "ideaTitleVi": "Ý tưởng",
  "descriptionEn": "...",
  "descriptionVi": "...",
  "images": [
    { "id": 11, "image": { "url": "https://..." }, "position": 0 }
  ]
}
```

### 8.3 Auth

#### `POST /auth/login`

Body:

```json
{ "email": "admin@example.com", "password": "secret" }
```

- Normalize email lowercase/trim.
- So sánh password hash với hàm constant-time của thư viện.
- Sai email hoặc password đều trả cùng `401 INVALID_CREDENTIALS`.
- Thành công tạo access token và refresh token, lưu **hash refresh token** trong `refresh_sessions`, set cookie, trả public user `{ id, email, role }`.
- Rate limit theo IP và email; ghi audit log không chứa password/token.

#### `GET /auth/me`

- Access token hợp lệ: `200` public user.
- Hết hạn/không hợp lệ: `401`; không tự refresh âm thầm trong endpoint này.

#### `POST /auth/refresh`

- Đọc refresh cookie, verify chữ ký/expiry và so token hash với session chưa revoke.
- Rotate refresh token: revoke session cũ, tạo session/token mới trong transaction.
- Phát hiện reuse token đã revoke: revoke chuỗi/session liên quan và trả 401.
- Set lại cả hai cookie và trả public user.

#### `POST /auth/logout`

- Idempotent.
- Nếu có refresh token thì revoke session tương ứng.
- Clear cả access/refresh cookie với cùng `path`, `domain`, `sameSite`, `secure` như lúc set.
- Trả `200 { data: { success: true } }` kể cả session đã hết.

### 8.4 Admin media/site

Tất cả endpoint dưới đây cần role `admin`.

#### `POST /admin/media/images`

- `multipart/form-data`, field `file`; field `purpose` thuộc `logo | avatar | home-slide | project-cover | project-gallery`.
- `201`: `data = { url, publicId, width, height, format }`.
- `413` nếu quá dung lượng; `422` nếu file không phải ảnh hợp lệ.

#### `PUT /admin/site/logo`

Body: `{ "image": { "url": "https://...", "publicId": "..." } }`.

- Validate HTTPS URL.
- Upsert singleton và trả logo mới.

#### `POST /admin/site/home-slides`

Body: `{ "image": AssetRef, "position"?: number, "alt"?: string }`.

- Không có position thì append.
- `201` trả slide vừa tạo.

#### `PATCH /admin/site/home-slides/reorder`

Body: `{ "items": [{ "id": 8, "position": 0 }, { "id": 3, "position": 1 }] }`.

- Không nhận ID trùng/position âm/trùng.
- Transaction cập nhật toàn bộ và trả list đã sort.

#### `DELETE /admin/site/home-slides/:id`

- `200` trả `{ deletedId }`; `404` nếu không tồn tại.
- Normalize position còn lại.

#### `PUT /admin/about`

Body tương ứng `AboutProfile`. Đây là replace singleton, field thiếu không được âm thầm thành `null`; FE phải gửi đầy đủ form.

### 8.5 Admin projects

#### `GET /admin/projects`

Trả danh sách phục vụ CMS; tối thiểu gồm summary, `updatedAt` và số ảnh.

#### `GET /admin/projects/:id`

Trả cùng shape đầy đủ như public, thêm metadata nội bộ cần cho form. Đây là endpoint duy nhất FE edit cần gọi.

#### `POST /admin/projects`

Body:

```json
{
  "name": "Listing name",
  "coverImage": { "url": "https://...", "publicId": "..." },
  "priority": 0,
  "displayName": "Detail name",
  "year": 2025,
  "location": "Ho Chi Minh City",
  "siteArea": "120 m²",
  "floorArea": "300 m²",
  "client": "Private client",
  "photographer": "Photographer",
  "ideaTitleEn": "Idea",
  "ideaTitleVi": "Ý tưởng",
  "descriptionEn": "English text",
  "descriptionVi": "Nội dung tiếng Việt",
  "images": [
    { "url": "https://...", "publicId": "...", "position": 0 }
  ]
}
```

- DTO bảo đảm 1–4 images và position hợp lệ.
- Transaction insert `projects`, `project_details`, `project_images`.
- `201` trả full project mới.

#### `PATCH /admin/projects/:id`

- Giữ nguyên ID.
- Scalar field có thể partial; nếu gửi `images` thì danh sách đó thay thế toàn bộ gallery.
- FE chuẩn gửi full form để validation nhất quán.
- Toàn bộ thay đổi trong một transaction; `404` nếu ID không tồn tại.
- `200` trả full project sau update.

#### `DELETE /admin/projects/:id`

- Transaction kiểm tra tồn tại rồi delete project; FK cascade detail/images.
- `200 { data: { deletedId } }`; `404` nếu không có.

#### `PATCH /admin/projects/reorder`

Body: `{ "items": [{ "id": 8, "priority": 0 }, { "id": 3, "priority": 1 }] }`.

- Không nhận ID trùng/priority âm.
- Cập nhật nguyên tử và trả summaries đã sort.

## 9. Authentication, cookie và authorization

### Token

- Access token TTL mặc định 15 phút.
- Refresh token TTL mặc định 7 ngày.
- Access JWT payload tối thiểu: `sub`, `role`, `type: "access"`, `iat`, `exp`, `jti`.
- Refresh JWT payload: `sub`, `sessionId`, `type: "refresh"`, `iat`, `exp`, `jti`.
- Dùng secret/key khác nhau; kiểm tra `issuer` và `audience`.

### Cookie

Giữ tên tương thích: `accessToken`, `refreshToken`.

- `httpOnly: true`.
- `secure: true` ở production.
- `sameSite: "lax"` nếu FE/BE cùng site; nếu thật sự cross-site dùng `"none"` + secure.
- Access cookie path `/`; refresh cookie có thể giới hạn `/api/v1/auth`.
- `maxAge` phải khớp TTL token.
- Domain lấy từ env nếu cần, không hard-code.

### CSRF/CORS

- CORS chỉ allow exact origin trong `FRONTEND_ORIGINS`, bật credentials; không dùng `*`.
- Với mutation cookie-auth, kiểm tra header `Origin`/`Referer` thuộc allowlist.
- Nếu triển khai cross-site, bổ sung double-submit CSRF token và FE gửi token qua header; không dựa riêng vào CORS.
- Role guard chạy sau access guard; không tin role từ request body.

## 10. DTO và validation

Dùng global `ValidationPipe` với:

```ts
{
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true
}
```

Validation quan trọng:

- ID: integer dương.
- Email: hợp lệ, lowercase, tối đa 320.
- Password login: string, có giới hạn độ dài để chống payload lớn; policy mạnh áp dụng khi tạo/đổi password.
- URL ảnh/website: URL HTTPS hợp lệ.
- String: trim, giới hạn độ dài phù hợp; multiline không biến thành HTML.
- `year`: integer 1900..currentYear.
- `priority/position`: integer không âm.
- Gallery: array 1–4, URL không trùng nếu muốn tránh lặp.
- Reorder: không có ID hoặc vị trí trùng; xác minh toàn bộ ID thuộc tập hợp đang quản lý.
- About update không cho field ngoài DTO.

## 11. Transaction và tính nhất quán

Các thao tác bắt buộc transaction:

- Create/update project.
- Reorder project/slides.
- Delete slide kèm normalize vị trí.
- Refresh token rotation.

Không lặp `await INSERT` từng ảnh ngoài transaction như code cũ. Dùng bulk insert/createMany khi ORM hỗ trợ.

Nếu update gallery theo replace:

1. Lock/check project.
2. Update scalar project/detail.
3. Delete images cũ trong DB.
4. Bulk insert images mới theo position.
5. Commit.
6. Dọn asset cloud không còn dùng sau commit hoặc qua job.

Race condition có thể giảm bằng `updatedAt`/optimistic concurrency; nếu triển khai thì mismatch trả `409 CONFLICT`.

## 12. Media/Cloudinary

Backend giữ toàn bộ credential. Dùng Cloudinary SDK hoặc provider tương đương qua interface để có thể mock test.

- Không dùng unsigned upload preset trong client.
- Tên folder/purpose được server quyết định; không cho client truyền arbitrary folder/public ID.
- Tạo public ID ngẫu nhiên, không ghép trực tiếp filename người dùng.
- Strip metadata nhạy cảm khi cần; có thể tạo WebP/AVIF qua delivery transform.
- Chỉ nhận URL asset do media service trả về hoặc validate hostname allowlist để tránh lưu URL độc hại.
- Log `publicId`, không log API secret/signature.

## 13. Cấu hình môi trường

```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
FRONTEND_ORIGINS=http://localhost:3000,https://www.example.com

JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-another-strong-secret
JWT_ISSUER=180-studio-api
JWT_AUDIENCE=180-studio-admin
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_ROOT_FOLDER=portfolio
MAX_IMAGE_SIZE_MB=15

PASSWORD_HASH_ROUNDS=12
TRUST_PROXY=1
```

- Validate env lúc bootstrap và fail fast.
- Không commit `.env`; cung cấp `.env.example` chỉ chứa key/dummy value.
- Không cần `SESSION_SECRET`, `express-session`, `connect-mongo`, Sequelize hoặc `pg-hstore`; source cũ khai báo nhưng không dùng cho luồng thực tế.
- Nếu Nest chạy sau reverse proxy, cấu hình trust proxy đúng để secure cookie và IP/rate limit hoạt động.

## 14. Bootstrap, middleware và vận hành

Trong `main.ts` cần:

- global prefix `/api/v1`;
- env/config validation;
- cookie parser;
- CORS exact allowlist + credentials;
- Helmet/security headers;
- request ID và structured logging;
- global validation pipe;
- global exception filter/response mapping;
- payload/body limit hợp lý;
- graceful shutdown hooks.

Health endpoints:

- `GET /api/v1/health/live`: process sống, không query phụ thuộc.
- `GET /api/v1/health/ready`: kiểm tra database; có thể kiểm tra media config nhẹ.

Không ghi password, cookie, JWT, refresh hash đầy đủ hoặc request body nhạy cảm vào log.

## 15. Migration dữ liệu cũ sang schema mới

### Mapping

| Cũ | Mới |
|---|---|
| `admin_auth` | `admin_users`; giữ `password_hash`, lowercase email; bỏ refresh token cũ |
| `app_logo.url` (`id=1`) | `site_settings.logo_url` |
| `poster` theo `id ASC` | `home_slides`, `position = row_number - 1` |
| `about_us` record `id=1` | `about_profiles`; `skill → skills`, `phone_studio → studio_phone`, `phone → personal_phone` |
| `project.name` | `projects.name` |
| `project.image_poster` | `projects.cover_image_url` |
| `project.priority` | `projects.priority`; null được normalize theo thứ tự cuối danh sách |
| `detail_project.id_project` | `project_details.project_id` |
| `name_project` | `display_name` |
| `text_english`, `text_vn` | `description_en`, `description_vi` |
| `idea_eng`, `idea_vie` | `idea_title_en`, `idea_title_vi` |
| `project_image` theo `id ASC` từng project | `project_images`, position từ 0 |

### Trình tự

1. Backup database và kiểm tra khả năng restore.
2. Dừng mutation hoặc bật maintenance window.
3. Chạy migration tạo schema mới.
4. Copy singleton, users, slides, projects, details, images trong transaction/batch có kiểm soát.
5. Không copy refresh token; buộc admin login lại.
6. Kiểm tra count, orphan, duplicate detail, URL null, year ngoài range và priority null.
7. So sánh mẫu response cũ/mới trên từng project.
8. Chuyển app sang schema mới; giữ backup đến khi nghiệm thu.

Nếu dữ liệu cũ có project thiếu detail/ảnh hoặc năm null, xuất báo cáo để người quản trị bổ sung; không tự bịa nội dung.

## 16. Bảo mật bắt buộc

- Password hash bằng bcrypt hoặc Argon2 với cost từ env; không lưu plaintext.
- Hai JWT secret khác nhau, đủ mạnh và rotate được.
- Hash refresh token trước khi lưu DB; rotation và revoke khi logout.
- Rate limit login/refresh/upload và toàn API ở mức nền.
- Exact CORS allowlist, Origin guard, CSRF khi cross-site.
- DTO whitelist, upload validation, body-size limit.
- Query qua ORM/parameterized SQL; không nối chuỗi đầu vào.
- Không expose `password_hash`, token/hash, internal IDs của session.
- Lỗi auth không tiết lộ user tồn tại.
- Dependency audit, secret scanning và backup DB định kỳ.
- Tài khoản seed lấy email/password từ secret deployment; không hard-code `admin/admin123`.

## 17. Kiểm thử bắt buộc

### Unit

- DTO validation và response mapping.
- Password verify, access/refresh generation, cookie options.
- Singleton upsert.
- Sort/normalize position và priority.
- Mapping entity → public DTO.
- Media MIME/size/purpose validation.

### Integration với database test

- Create project tạo đúng 3 nhóm record.
- Một bước create/update lỗi thì rollback toàn bộ.
- Update giữ nguyên ID và replace gallery đúng thứ tự.
- Delete cascade detail/images.
- One-to-one project detail và singleton constraint.
- Refresh rotation, reuse/revocation và logout idempotent.
- Reorder concurrent/invalid không tạo duplicate position.

### End-to-end

- Tất cả public endpoint và 404.
- Login sai/đúng, `/me`, refresh, logout, cookie flags.
- Anonymous/role sai bị chặn khỏi admin.
- CRUD logo/About/slides/projects.
- Upload hợp lệ, MIME giả, quá dung lượng.
- CORS/origin hợp lệ và bị từ chối.
- Error envelope luôn đúng format, không rò stack.

## 18. Các lỗi backend cũ không được sao chép

- `generateAccessToken` đặt `expiresIn: "10s"` trái với comment và cookie 15 phút.
- Middleware refresh dùng `if (1)` nên mọi lỗi JWT đều bị coi là access token hết hạn.
- Refresh token lưu plaintext trong cột user và chỉ hỗ trợ một session.
- Update project xóa project trước rồi gọi create; ID đổi và lỗi giữa chừng gây mất dữ liệu.
- Create project insert tuần tự nhưng không transaction.
- Controller chỉ validate cover/name/images; các field form required còn lại có thể bị bỏ trống.
- UI nói gallery tối đa 4 nhưng backend không enforce.
- API project detail/ảnh/basic bị chia nhỏ và response không thống nhất.
- `get projects` không bọc try/catch/response envelope.
- Update logo có model đọc field `link` dù DB là `url`; public lại trả mảng.
- Add background chỉ append, không có list admin/delete/reorder; request cũ còn thiếu cookie.
- About update luôn `WHERE id = 1` nhưng không upsert và bỏ qua kết quả row count.
- DB kết nối hai lần lúc start; `dotenv.config()` được gọi sau khi import app/db ở `server.js` dù `db.js` tự load dotenv.
- Cấu hình session, Sequelize, Mongo session và nhiều dependency không dùng.
- Cookie luôn `secure: true`, gây khó cho HTTP local; CORS chỉ hỗ trợ một origin string.
- Không có global error handler/validation/rate limit/helmet/health check.
- Nội dung log có token flow/user object quá chi tiết và source bị lỗi encoding tiếng Việt.

## 19. Definition of Done cho BE mới

Backend được coi là hoàn thành khi:

- API contract khớp tuyệt đối với tài liệu FE.
- Migration dựng được DB sạch và chuyển được dữ liệu cũ có kiểm chứng.
- Create/update/delete/reorder dùng transaction và giữ toàn vẹn quan hệ.
- Edit project giữ ID; delete cascade đúng.
- Auth cookie hoạt động dev/production, access 15 phút, refresh 7 ngày, rotation/revoke đúng.
- Không lưu hoặc log plaintext password/token; không có secret trong source.
- Media upload có auth, kiểm tra loại/dung lượng và không cần unsigned preset ở FE.
- Public response camelCase, ổn định và không lộ field nội bộ.
- Unit/integration/e2e quan trọng đều pass; lint/type-check/build pass.
- Health check, structured log, graceful shutdown và env validation hoạt động.

## 20. Mapping route cũ sang API mới

| Express cũ | NestJS mới |
|---|---|
| `GET /api/home` | `GET /api/v1/site/home-slides` |
| `GET /api/logo_app` | `GET /api/v1/site/logo` |
| `GET /api/about_us` | `GET /api/v1/about` |
| `GET /api/projects` | `GET /api/v1/projects` |
| `GET /api/projects/img/:id` + `GET /api/detail_project/:id` | `GET /api/v1/projects/:id` |
| `POST /api/auth/login` | `POST /api/v1/auth/login` |
| `GET /api/auth/me` | `GET /api/v1/auth/me` |
| `POST /api/auth/logout` | `POST /api/v1/auth/logout` |
| implicit refresh trong middleware | `POST /api/v1/auth/refresh` |
| `PUT /api/admin/update_logo` | `PUT /api/v1/admin/site/logo` |
| `POST /api/admin/add_background` | slide create/reorder/delete endpoints |
| `PUT /api/admin/update_about_us` | `PUT /api/v1/admin/about` |
| `POST /api/admin/crud_project/add` | `POST /api/v1/admin/projects` |
| `PUT /api/admin/crud_project/update/:id` | `PATCH /api/v1/admin/projects/:id` |
| `DELETE /api/admin/crud_project/delete/:id` | `DELETE /api/v1/admin/projects/:id` |
| `GET /api/admin/project/:id` | `GET /api/v1/admin/projects/:id` |

