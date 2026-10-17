# Review Log

Newest first. Written automatically on every review request (`directives/agent-workflow.md` §5). Statuses: `Open`, `Fixed`, `Won't fix`.

## 2026-10-17 (decision) — R-20261017-2 resolved by a domain rule

The owner decided every project must have at least one image (the cover). Implemented at write time: `@ArrayMinSize(1)` on `CreateProjectRequest.projectImages`, and `Project.create()` throws `InvalidProjectError('project must have at least one image')` when the list is empty.

Verified: `npm run build` passes; `prettier --check` clean on the two changed files; a throwaway script confirmed the DTO reports `arrayMinSize` for `[]` and accepts one image, and the entity throws for `[]`.
Not verified: live `POST /api/projects` and `GET /api/projects` against the database.

Follow-up the same day: the owner also required a cover image. `Project.create()` now also throws `InvalidProjectError('project must have at least one cover image (coverPriority is not null)')` when every image has `coverPriority === null`. A throwaway script checked five cases (no images, one null-priority image, all null, one cover among others, one cover only): the first three throw, the last two pass. Seed data: every seeded project has 4 images, 2 of them with a cover priority.

Request-level check added the same day: custom decorator `@HasCoverImage()` in `presentation/validators/has-cover-image.validator.ts`, applied to `CreateProjectRequest.projectImages`. A throwaway script checked five payloads: `[]`, one image without priority and two images with only null priorities fail with `hasCoverImage`; one image with `coverPriority: 0` passes. The entity rule stays as the second layer.

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
