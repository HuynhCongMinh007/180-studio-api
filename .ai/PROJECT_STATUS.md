# Backend Status

Updated: 2026-10-17

Phase: learning NestJS, DDD and CQRS on the portfolio API. There is no inherited spec; requirements come from `docs/tasks/`.

## Built

| Module | Endpoint | Style |
|---|---|---|
| auth | `POST /api/login` | use-case class (`LoginUseCase`), JWT, bcrypt |
| home | `GET /api/home-slides` | CQRS query returning `HomeSlideView[]` |
| project | `GET /api/projects` | CQRS query returning `ProjectView[]` |
| project | `POST /api/projects` (admin) | CQRS command returning `{ projectId }`, publishes `ProjectCreatedEvent` (logged) |

Platform:

- Prisma 7.10 with `@prisma/adapter-pg`; migrations in `prisma/migrations/` (home slides, project, user, session index, area to int).
- `main.ts`: global prefix `api`, `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, no `transform`), `GlobalExceptionFilter`.
- Success envelope `ResponseDto`: `{ success, message, requestId, timestamp, data, metadata? }`.
- `CqrsModule.forRoot()` in `AppModule`.

## Current focus

Practising the EventBus and the query view pattern.

## Next

- T-001 (in review): `ListProjectQuery` now returns `ProjectView[]`; close it after the minor findings are fixed.
- Verify `POST /api/projects` against the database and check the `ProjectCreatedHandler` log line.

## Known debt

- Open review findings (`.ai/REVIEW_LOG.md`): minor style items R-20261017-4 to -7 only.
- Domain rules: a project must have at least one image and at least one image with a non-null `coverPriority`. Enforced twice: request DTO (`@ArrayMinSize(1)`, `@HasCoverImage()`) and `Project.create()`. Existing database rows that break either rule would make `GET /api/projects` fail; the seed data is compliant, other data is unchecked.
- No tests. `test:e2e` points to `test/jest-e2e.json`, which does not exist.
- `auth` is not migrated to CQRS.
- Mixed constructor DI style and import style (alias vs relative); see `directives/code-style.md`.
