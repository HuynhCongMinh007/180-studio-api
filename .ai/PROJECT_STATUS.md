# Backend Status

Current phase: NestJS scaffolded (CommonJS + Jest); Prisma 7.10.0 with PostgreSQL driver adapter; first feature module (`home`) built with the layered architecture in `directives/architecture.md`.

Done:
- `src/database/` — global `DatabaseModule` + `PrismaService` (`@prisma/adapter-pg`).
- `prisma/schema.prisma` — `HomeSlide` model (`home_slides`, spec §5.5). Client is generated into `src/generated/prisma` (git-ignored, regenerated on `postinstall`).
- `src/modules/home/` — `GET /api/v1/site/home-slides` (spec §8.1) across domain/application/infrastructure/presentation, with unit tests.
- Global prefix `api/v1` set in `main.ts`.

Next task: start Postgres, run the first migration (`npm run prisma:migrate -- --name init`), and verify the home-slides endpoint against a real database.

Known debt:
- No migration generated yet (no database available when the model was added). `CHECK (position >= 0)` from spec §5.5 must be added by hand to the migration SQL; Prisma schema cannot express it.
- Admin home-slide endpoints (spec §8.4: create, reorder, delete) are not built; they need the auth + admin role guard first.
- Responses are not yet wrapped in the `{ data, meta: { requestId } }` envelope (spec §7); needs the global response interceptor and exception filter.
- `PrismaService` reads `process.env.DATABASE_URL` directly and the Nest runtime does not load `.env` yet (only `prisma7.config.ts` does); fix with the config module (`src/config/`, spec §13).
- `ObserveModule` in `app.module.ts` still uses placeholder credentials from the scaffold.
