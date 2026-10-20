# Code Style

Formatting is Prettier (`.prettierrc`: no semicolons, single quotes; 2-space indent). Lint is `oxlint`. Commands: `npm run format`, `npm run lint`.

## Naming

| Thing | File | Symbol |
|---|---|---|
| Command | `create-project.command.ts` | `CreateProjectCommand` |
| Command handler | `create-project.handler.ts` | `CreateProjectHandler` |
| Query | `list-home-slides.query.ts` | `ListHomeSlidesQuery` |
| Query handler | `list-home-slides.handler.ts` | `ListHomeSlidesHandler` |
| View | `home-slide.view.ts` | `HomeSlideView` |
| Event | `project-created.event.ts` | `ProjectCreatedEvent` |
| Event handler | `project-created.handler.ts` | `ProjectCreatedHandler` |
| Port | `project.repository.ts` | `ProjectRepository` (abstract class) |
| Query port | `project-query.repository.ts` | `ProjectQueryRepository` (abstract class, returns read models) |
| Read model | `project-summary.ts`, `project-detail.ts` | `ProjectSummary`, `ProjectDetail` (one plain interface per file in `domain/read-models/`) |
| List request DTO | `list-projects.request.dto.ts` | `ListProjectsRequest` (`page`, `limit`) |
| Detail query | `get-project/get-project.query.ts` | `GetProjectQuery`, view `ProjectDetailView` in `project-detail.view.ts` |
| Adapter | `prisma-project.repository.ts` | `PrismaProjectRepository` |
| Query adapter | `prisma-project-query.repository.ts` | `PrismaProjectQueryRepository` |
| Mapper | `project-response.mapper.ts` | `toProjectResponse()` (plain function) |

Class names match the file name. Event folders are named after the event (`events/project-created/`).

## Classes

- Entities and value objects: `private constructor`, `static create()` that validates, `private readonly _field`, getters.
- Commands, queries, events: `public readonly` constructor parameters, no logic.
- DI: both constructor styles exist (`private readonly x: X` parameter properties, and a `_x` field assigned in the constructor). Match the file being edited; do not rewrite files only to change style.
- Handlers hold dependencies only. Request data lives in `execute()` parameters and locals, never in handler fields.

## Types

- `@IsOptional()` does not change the TypeScript type. Optional DTO fields are declared `field?: T`.
- Normalise `undefined` to `null` at the presentation boundary before building a command.

## Imports

- Prefer the `@/` alias for cross-layer imports. Some older files use relative paths; leave them unless already editing the file.

## Errors

- Domain errors extend `DomainError`, application errors extend `ApplicationError`; each sets `code` and `kind`. `GlobalExceptionFilter` maps `kind` to the HTTP status.
