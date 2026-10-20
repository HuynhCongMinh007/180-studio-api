# Backend Status

Updated: 2026-10-19

Phase: learning NestJS, DDD and CQRS on the portfolio API. There is no inherited spec; requirements come from `docs/tasks/`.

## Built

| Module | Endpoint | Style |
|---|---|---|
| auth | `POST /api/login` | use-case class (`LoginUseCase`), JWT, bcrypt |
| home | `GET /api/home-slides` | CQRS query returning `HomeSlideView[]` |
| project | `GET /api/projects` | CQRS query returning `ProjectView[]`, read through `ProjectQueryRepository` (read model `ProjectSummary`, no entity) |
| project | `POST /api/projects` (admin) | CQRS command returning `{ projectId }`, publishes `ProjectCreatedEvent` (logged) |

Platform:

- Prisma 7.10 with `@prisma/adapter-pg`; migrations in `prisma/migrations/` (home slides, project, user, session index, area to int).
- `main.ts`: global prefix `api`, `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, no `transform`), `GlobalExceptionFilter`.
- Success envelope `ResponseDto`: `{ success, message, requestId, timestamp, data, metadata? }`.
- `CqrsModule.forRoot({ commandPublisher: new LoggingCommandPublisher() })` in `AppModule`: logs each command name (teaching example).

## Current focus

Practising the EventBus and the query view pattern.

## Next

- T-001 (in review): `ListProjectQuery` now returns `ProjectView[]`; close it after the minor findings are fixed.
- Verify `POST /api/projects` against the database and check the `ProjectCreatedHandler` log line.

## Known debt

- Pending: apply migration `20261017120000_project_image_surrogate_id` (`npm run prisma:migrate`). Until then a project with the same image URL twice still fails in the database with HTTP 500.
- Open review findings (`.ai/REVIEW_LOG.md`): minor items R-20261017-4, -6, -9. Most useful next: R-9 (tests).
- Transactions: `TransactionManager` port + `PrismaTransactionManager` + `getTx` context exist and are used by `CreateProjectHandler` (one nested write today, so atomicity comes from Prisma itself). Only `PrismaProjectRepository` uses `getTx`; every new repository that joins a transaction must do the same (`directives/architecture.md`, section Transactions).
- Text and number limits mirror the database column types (255, 2048, 1024 characters; Int and SmallInt ranges); `name` has a business limit of 255. All are enforced in the domain and repeated in the DTO.
- Domain rules for project images: 1 to 20 images; `coverPriority` is null or an integer from 0 to 32767; at least one and at most 10 images with a non-null `coverPriority`; no two images share a `coverPriority`. Enforced twice: request DTO (`@ArrayMinSize(1)`, `@ArrayMaxSize(20)`, `@HasCoverImage()`, `@MaxCoverImages(10)`, `@UniqueCoverPriorities()`, `@IsInt() @Min(0)` on `coverPriority`) and `Project.create()`. Existing database rows that break either rule would make `GET /api/projects` fail; the seed data is compliant, other data is unchecked.
- No tests. `test:e2e` points to `test/jest-e2e.json`, which does not exist.
- `auth` is not migrated to CQRS.
- Mixed constructor DI style and import style (alias vs relative); see `directives/code-style.md`.
