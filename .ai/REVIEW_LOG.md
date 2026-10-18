# Review Log

Newest first. Written automatically on every review request (`directives/agent-workflow.md` §5). Statuses: `Open`, `Fixed`, `Won't fix`.

## 2026-10-17 (demo) — `commandPublisher` example and a bug found while running it

Added `src/shared/application/cqrs/logging-command.publisher.ts` (`LoggingCommandPublisher`, logs `Dispatch <CommandName>`) and wired it in `app.module.ts`: `CqrsModule.forRoot({ commandPublisher: new LoggingCommandPublisher() })`. Unlike the event publisher, replacing the command publisher is safe: `CommandBus.execute()` looks the handler up in a map and only calls `publisher.publish()` as a side hook (`command-bus.js:62-70`).

Verified: `npm run build` passes; `oxlint` shows only R-7; `prettier --check` clean on the two files. A throwaway Nest testing module (real `CreateProjectHandler` and `ProjectCreatedHandler`, an in-memory repository) printed `Dispatch CreateProjectCommand`, then the event log line, then the `execute()` result. No database needed.
Not verified: live `POST /api/projects`.

Found while running the demo (not changed, per review rules):

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-12 | Blocking (by definition: wrong behaviour; only the log line is affected today) | `project-created.event.ts` and `create-project.handler.ts:37` | `ProjectCreatedEvent` is declared `(name, projectId)` but published as `(project.id, project.name)`. Both are strings, so TypeScript cannot catch it. The log prints `Project created: Demo house(<uuid>)`: `projectId` holds the name and `name` holds the id | Fixed 2026-10-17 (call is now `new ProjectCreatedEvent(project.name, project.id)`, matching the constructor) |

## 2026-10-17 (fixes) — name limit and R-11 (schema)

Changes:
- `name` limited to 255 characters (`PROJECT_NAME_MAX_LENGTH` in `project.entity.ts`), checked in `Project.create()` and in the DTO (`@MaxLength`). This is a business limit; the `name` column is unbounded TEXT.
- R-11: `ProjectImage` primary key changed from `(projectId, imageUrl)` to a surrogate `id` (`@default(dbgenerated("gen_random_uuid()"))`), so one project may hold the same `imageUrl` twice. The unique `(projectId, coverPriority)` stays and still serves as the index on `project_id`. The new column has a database default, so `prisma/seeds/projects.sql` keeps working without an id.
- Migration `prisma/migrations/20261017120000_project_image_surrogate_id/migration.sql`, taken from `prisma migrate diff` between the old and new schema. Existing rows each get their own id (volatile default).

Verified: `prisma validate` passes; `prisma generate` ran; `npm run build` passes; `oxlint` shows only R-7; a throwaway script checked the name limit (255 ok, 256 and blank rejected) in DTO and domain.
Not verified: the migration was **not applied** to any database; no live request; no tests.

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-11 | Minor | `prisma/schema.prisma` `ProjectImage` | Primary key rejected duplicate image URLs | Fixed in code 2026-10-17; becomes effective once the migration is applied |

## 2026-10-17 (fixes) — R-8, R-10 and the duplicate-URL rule

Changes:
- Removed the "no repeated `imageUrl` in one payload" rule: deleted `@UniqueImageUrls()` and its file, and the check in `Project.create()`. The owner will store images on S3 (new key per upload), so duplicates are rare and allowed.
- R-8: added limits that mirror the database columns, in the domain and again in the DTO. `location`, `client`, `photographer` at most 255 characters; `videoUrl` at most 2048; `imageUrl` at most 1024 (`ProjectImage`); `siteArea` and `floorArea` at most 2147483647; `coverPriority` at most 32767. Limits are exported constants (`PROJECT_*_MAX_*` in `project.entity.ts`, `PROJECT_IMAGE_*` in `project-image.vo.ts`) that the DTO imports.
- R-10: decided and documented in `directives/architecture.md`: presentation may import domain constants and plain value types read-only; it never calls domain behaviour.

Verified: `npm run build` passes; `prettier --check` clean except the two files of R-5; a throwaway script ran 14 cases (each limit at its maximum and one over, and the same URL twice) against the DTO and the domain; they agreed on every case.
Not verified: no live request; no automated tests.

Open risk: the table `project_images` has primary key `(project_id, image_url)`. A payload with the same URL twice now passes the DTO and the domain, then fails in the database (Prisma unique violation) and returns HTTP 500. Fixing it needs a schema migration (R-20261017-11).

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-8 | Minor | DTO and domain | Missing length and range limits that match the column types | Fixed 2026-10-17 |
| R-20261017-10 | Minor | `project.request.dto.ts` | DTO imports limits from the domain | Fixed 2026-10-17 (decision documented) |
| R-20261017-11 | Minor | `prisma/schema.prisma` `ProjectImage` | Primary key `(projectId, imageUrl)` rejects the duplicate URLs that the application now allows; result is HTTP 500 | Open |

## 2026-10-17 (audit) — validation rules: DTO versus domain

Scope: `presentation/dtos/project.request.dto.ts`, `presentation/validators/*`, `domain/entities/project.entity.ts`, `domain/value-objects/project-image.vo.ts`, `prisma/schema.prisma` (column types).

Verified: read all rules in both layers; compared them with the column types; the earlier throwaway scripts showed DTO and entity agree on the image rules.
Not verified: no live request; no automated tests exist.

Result: no rule is in the wrong layer. Every business rule has a domain implementation, and each image rule is repeated in the DTO on purpose. The audit found gaps, not misplaced rules.

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-8 | Minor | DTO and domain | No length limits matching the columns (`location`, `client`, `photographer` VarChar(255), `videoUrl` VarChar(2048), `imageUrl` VarChar(1024)) and no upper bound for `siteArea`/`floorArea` (Int), `coverPriority` (SmallInt). A too-long or too-large value reaches Prisma and returns HTTP 500 instead of 400 | Open |
| R-20261017-9 | Minor | whole module | No automated tests keep the DTO rules and the domain rules in sync | Open |
| R-20261017-10 | Minor | `project.request.dto.ts:13-16` | The DTO imports `PROJECT_MAX_*` from the domain entity. The direction is inward, but it bypasses application; acceptable, noted so it is a conscious choice | Open |

## 2026-10-17 (decision) — R-20261017-2 resolved by a domain rule

The owner decided every project must have at least one image (the cover). Implemented at write time: `@ArrayMinSize(1)` on `CreateProjectRequest.projectImages`, and `Project.create()` throws `InvalidProjectError('project must have at least one image')` when the list is empty.

Verified: `npm run build` passes; `prettier --check` clean on the two changed files; a throwaway script confirmed the DTO reports `arrayMinSize` for `[]` and accepts one image, and the entity throws for `[]`.
Not verified: live `POST /api/projects` and `GET /api/projects` against the database.

Follow-up the same day: the owner also required a cover image. `Project.create()` now also throws `InvalidProjectError('project must have at least one cover image (coverPriority is not null)')` when every image has `coverPriority === null`. A throwaway script checked five cases (no images, one null-priority image, all null, one cover among others, one cover only): the first three throw, the last two pass. Seed data: every seeded project has 4 images, 2 of them with a cover priority.

Request-level check added the same day: custom decorator `@HasCoverImage()` in `presentation/validators/has-cover-image.validator.ts`, applied to `CreateProjectRequest.projectImages`. A throwaway script checked five payloads: `[]`, one image without priority and two images with only null priorities fail with `hasCoverImage`; one image with `coverPriority: 0` passes. The entity rule stays as the second layer.

Limits added the same day: within one payload no two images may share a `coverPriority`, and at most 10 images may have one (`PROJECT_MAX_COVER_IMAGES = 10` in `project.entity.ts`). Enforced twice: DTO decorators `@MaxCoverImages(10)` and `@UniqueCoverPriorities()` in `presentation/validators/cover-priority.validators.ts`, and `Project.create()` (`InvalidProjectError`). A throwaway script ran 7 cases against both layers and they agreed on every case (same priority twice, 10 vs 11 covers, many non-cover images, repeated nulls).

Image limits added the same day: at most 20 images per project (`PROJECT_MAX_IMAGES`), no repeated `imageUrl` in one project (exact string match, same as the `(projectId, imageUrl)` primary key), `coverPriority` an integer of 0 or more. The negative-priority rule already lived in `ProjectImage.create()`; the DTO now also has `@IsInt()` and `@Min(0)`. Duplicate-URL uniqueness is a collection rule, so it is checked in `Project.create()` and in the DTO decorator `@UniqueImageUrls()`, not in the `ProjectImage` value object. A throwaway script ran 7 cases (20 vs 21 images, same URL twice, negative, fractional and zero priority, valid mix) against both layers; they agreed on every case.

Residual risk: `Project.create()` also runs when loading rows, so a project row with no `project_images` makes the whole list fail with "Corrupt project record". The seed file satisfies the rule; any other existing data was not checked. `toProjectView` therefore keeps the unguarded `projectImages[0]`.

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-2 | Blocking | `list-project-view.mapper.ts:8` | No-image crash | Fixed 2026-10-17 (by the invariant above) |

## 2026-10-17 (re-review) — T-001 after the owner's fixes

Scope: findings R-20261017-1 to -6, files in `src/modules/project/application/queries/list-projects/`, `presentation/controllers/public-project.controller.ts`, `presentation/mappers/project-response.mapper.ts`.

Verified: `npm run build` (passes), `npx oxlint src` (1 warning, R-20261017-7), `npx prettier --check "src/**/*.ts"` (2 files still need formatting).
Not verified: app not started, no live request, no tests.

Result: R-1 and R-3 fixed. R-2 (Blocking) is still open: the mapper still reads `projectImages[0].imageUrl` without a guard.

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-7 | Minor | `public-project.controller.ts:2` | Unused import `Project` (oxlint `no-unused-vars`); the manual `ProjectView[]` annotation on the `execute()` result is also redundant now that the query extends `Query<ProjectView[]>` | Open |

## 2026-10-17 — T-001: ListProjectQuery view

Scope: `src/modules/project/application/queries/list-projects/*`, `presentation/controllers/public-project.controller.ts`, `presentation/mappers/project-response.mapper.ts`.

Verified: `npm run build` (fails, R-1), `npx oxlint src/modules/project` (clean), `npx prettier --check` (2 files need formatting).
Not verified: app not started, no live request, no tests.

| ID | Severity | Where | Finding | Status |
|---|---|---|---|---|
| R-20261017-1 | Blocking | `public-project.controller.ts:19` | Build error TS2322: result annotated `Project[]` but the query now returns `ProjectView[]` | Fixed 2026-10-17 |
| R-20261017-2 | Blocking | `list-project-view.mapper.ts:8` | `project.projectImages[0].imageUrl` throws `TypeError` for a project with no images (empty list is valid); the old response mapper returned `null` | Open |
| R-20261017-3 | Rule | `project-response.mapper.ts:4` | `toProjectResponse` still takes the `Project` entity; per `directives/architecture.md` it must map `ProjectView` to `ProjectResponse` | Fixed 2026-10-17 |
| R-20261017-4 | Minor | `list-projects.handler.ts:8-11` | Stale generic `IQueryHandler<ListProjectQuery, Project[]>`; result type comes from `Query<ProjectView[]>`, so use `IQueryHandler<ListProjectQuery>` | Open |
| R-20261017-5 | Minor | `list-projects.query.ts:2`, `create-project.command.ts:3` | Prettier violations (stray `;`, `Command<{projectId:string}>`); run `npm run format` | Open |
| R-20261017-6 | Minor | `list-project.view.ts`, `list-project-view.mapper.ts` | File and symbol names differ from the query folder (`list-projects`) and from the `home` pattern; see `directives/code-style.md` | Open |
