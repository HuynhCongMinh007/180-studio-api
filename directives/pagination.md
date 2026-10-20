# Pagination (page/limit)

Same approach as `reflective-andon-api`: the query repository counts and builds the pagination meta; everything else just passes it along.

## Flow

```text
GET /api/projects?page=2&limit=10
  ListProjectsRequest          page, limit: @Type(() => Number) @IsInt @Min(1) (limit also @Max(100)), defaults 1 and 10
  new ListProjectsQuery(page, limit)
  ProjectQueryRepository.findAll(page, limit)
                               findMany(skip, take) + count() in Promise.all
                               returns { items, pagination: PaginationMeta }
  handler                      { items: items.map(toProjectView), pagination }
  controller                   ResponseDto({ data: items -> responses, metadata: pagination })
```

Shared: only `PaginationMeta` in `src/shared/domain/pagination.ts` (used by ports, views and `ResponseDto.metadata`).
Reference: `src/modules/project/` list query.

## Rules

- Query strings arrive as strings: every number needs `@Type(() => Number)`.
- Fields with a default are typed without `?` (`page: number = 1`).
- `limit` needs `@Min(1)`: `0` divides by zero in `totalPages`, a negative value reaches Prisma `take`.
- End `orderBy` with a unique column (`{ id: 'asc' }`) so pages are stable.
- `totalPages = Math.ceil(total / limit)`, `nextPage`/`prevPage` are `null` at the edges.
