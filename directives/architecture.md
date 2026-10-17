# Module Architecture (Clean / Hexagonal / DDD + CQRS)

Each feature lives in `src/modules/<feature>/`. Reference implementations: `project` (query, command, event) and `home` (query with an application view).

```text
src/modules/<feature>/
  domain/            entities, value objects, domain errors, repository ports (abstract classes)
  application/
    commands/<name>/   <name>.command.ts, <name>.handler.ts
    queries/<name>/    <name>.query.ts, <name>.handler.ts, <thing>.view.ts, <thing>-view.mapper.ts
    events/<name>/     <name>.event.ts, <name>.handler.ts
  infrastructure/    Prisma repositories, records, record -> entity mappers, external adapters
  presentation/      controllers, request DTOs, response DTOs, response mappers, custom validators
  <feature>.module.ts   registers handlers and binds ports to adapters
```

`auth` still uses a use-case class (`application/use-cases/login.use-case.ts`) until it is migrated to CQRS.

## Dependency rule

Dependencies point inward only: `presentation -> application -> domain <- infrastructure`.

- `domain/` imports nothing from Nest, Prisma, `src/generated` or other layers. Invariants live in `Entity.create()` and throw `DomainError` subclasses.
- `application/` depends on domain only, plus decorators from `@nestjs/cqrs` and `@nestjs/common`. It never imports from `presentation/`.
- `infrastructure/` implements domain ports. Prisma record types never leave this layer.
- `presentation/` talks to `CommandBus` and `QueryBus` only, never to handlers, repositories or `PrismaService`.

## Data shapes and mapping chain

| Shape | Layer | Built by |
|---|---|---|
| Request DTO (class-validator) | presentation | `ValidationPipe` |
| Command / Query (data only) | application | controller, from the DTO |
| Entity / value object | domain | `Entity.create()` in the command handler, or `toX(record)` when loading |
| Prisma record | infrastructure | Prisma |
| View (read model, interface) | application | `toXView(entity)` next to the query |
| Response DTO | presentation | `toXResponse(view)` in `presentation/mappers/` |

- Read: record -> entity -> view -> response.
- Write: DTO -> command -> entity -> record.

The view/response split is deliberate. The extra mapping keeps `application/` free of presentation types. Query handlers return views, never response DTOs. When a view and its response have the same shape, the mapping is still kept so the HTTP contract can change without touching the application layer.

## Ports and wiring

- A port is an `abstract class` in `domain/` and doubles as the DI token: `{ provide: XRepository, useClass: PrismaXRepository }`.
- Every command, query and event handler is listed in the feature module's `providers`.
- `CqrsModule.forRoot()` is imported once, in `AppModule`; it is global.

## Shared code

- `src/database/`: global `DatabaseModule` and `PrismaService`.
- `src/shared/domain|application|presentation/`: base errors (`DomainError`, `ApplicationError`, `PresentationError`), `Role`, guards, `@Roles`, `GlobalExceptionFilter`, `ResponseDto`, request context.
- `src/lib/utils/`: small pure helpers (`isBlank`, `isHttpsUrl`, `isPresent`).

## Testing

No tests exist yet. When added, test handlers with an in-memory implementation of the port and no database.
