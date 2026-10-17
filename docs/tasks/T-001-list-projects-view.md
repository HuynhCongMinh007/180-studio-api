# T-001 — Return a view from ListProjectQuery

Status: Review
Owner: project owner · Updated: 2026-10-17

## 1. Problem and why

`ListProjectQuery` returns `Project` entities and has no result type, so `PublicProjectController` annotates `Project[]` by hand and maps entities straight to the response. This breaks the read-side rule in `directives/architecture.md` (queries return views) and differs from `home`.

## 2. Goal

`GET /api/projects` reads through a typed query that returns an application view, with the HTTP response unchanged.

## 3. Scope

In:

- View, view mapper, query, handler and presentation mapper for the project list.

Non-goals:

- Pagination or filtering.
- Changing the repository port or the Prisma query.
- Changing the response shape.

## 4. Requirements

1. R1 A project list view interface exists next to the query.
2. R2 The query extends `Query<View[]>`; the controller no longer annotates the result type by hand.
3. R3 The handler maps entities to views with a plain `toXView()` function.
4. R4 `toProjectResponse()` takes the view, not the entity.
5. R5 The presentation layer no longer imports the `Project` entity for this endpoint.

## 5. Acceptance criteria

- Given projects exist, when `GET /api/projects` is called, then `data` has the same items and fields as before (`id`, `name`, `imageUrl`).
- Given a project without images, when listed, then its `imageUrl` is `null`.
- `npm run build` and `npm run lint` pass.

## 6. HTTP contract

No contract change.

## 7. Learning goals

- Read model versus entity.
- The read mapping chain: record -> entity -> view -> response.
- Result-type inference with `Query<T>`.

## 8. Hints

- Reference: `src/modules/home/application/queries/list-home-slides/`.
- Current mapping: `src/modules/project/presentation/mappers/project-response.mapper.ts`.
- The repository only loads the cover image (`take: 1` in `prisma-project.repository.ts`).

## 9. Open questions

- Should "pick the first image" live in the view mapper (view has `coverImageUrl`) or in the response mapper (view carries the image list)?
- Rename `ListProjectQuery`/`ListProjectHandler` to `ListProjectsQuery`/`ListProjectsHandler` to match the file names?

## 10. Review notes

2026-10-17: build fails (R-20261017-1), view mapper crashes on a project with no images (R-20261017-2), `toProjectResponse` still takes the entity (R-20261017-3). Details in `.ai/REVIEW_LOG.md`.
2026-10-17 (re-review): build passes; R-1 and R-3 fixed. R-2 (no-image crash) still open, plus minor R-4 to R-7.
2026-10-17 (decision): R-2 closed by a domain rule (at least one image per project). Remaining: minor R-4 to R-7.
