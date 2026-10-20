# Knowledge Index

Open only the row that matches the question.

| Question about | Read |
|---|---|
| How the agent behaves and answers | `AGENTS.md`, `directives/agent-workflow.md` |
| Where the project is, what is next | `.ai/PROJECT_STATUS.md`, `docs/tasks/INDEX.md` |
| Open review findings, review history | `.ai/REVIEW_LOG.md` |
| Layers, dependency rule, mapping chain | `directives/architecture.md` |
| Commands, queries, events, buses | `directives/cqrs.md`, then `src/modules/project/application/` |
| Naming, formatting, DI style, DTO types | `directives/code-style.md` |
| Past decisions, gotchas, corrected misconceptions | `.ai/memory/lessons.jsonl` (grep by `topic`) |
| `@nestjs/cqrs` internals | `node_modules/@nestjs/cqrs/dist/` (`query-bus`, `command-bus`, `event-bus`, `cqrs.module`, `event-publisher`, `.d.ts` files) |
| Database schema and migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| Prisma CLI or Client API | vendor skills in `.claude/skills/prisma-*` |
| Error to HTTP status | `src/shared/presentation/filters/global-exception.filter.ts`, `src/shared/presentation/constants/error.constants.ts` |
| Pagination (page/limit, metadata) | `directives/pagination.md` |
| Success response envelope | `src/shared/presentation/dtos/response.dto.ts` |
| Auth guards and roles | `src/shared/presentation/guards/`, `src/shared/presentation/decorators/role.decorator.ts` |
| Bootstrap (prefix, pipes, filters, modules) | `src/main.ts`, `src/app.module.ts` |

## Reference implementations

- Query with view: `src/modules/home/application/queries/list-home-slides/`
- Command and event: `src/modules/project/application/commands/create-project/`, `src/modules/project/application/events/project-created/`
- Port and adapter wiring: `src/modules/project/project.module.ts`
- Entity with invariants: `src/modules/project/domain/entities/project.entity.ts`
- Paginated list through a query repository: `src/modules/project/application/queries/list-projects/`
- Detail read with not-found: `src/modules/project/application/queries/get-project/`

## Commands

`npm run dev` (watch mode) · `npm run build` · `npm run lint` · `npm run format` · `npm test` · `npm run prisma:migrate` · `npm run prisma:studio`
