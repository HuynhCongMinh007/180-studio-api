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
- `presentation/` may import domain constants and plain value types for read-only use: validation limits in DTO decorators (`PROJECT_MAX_IMAGES`), `Role`, `Token`. It never calls domain behaviour (`Entity.create()`, ports). This keeps one source for each limit without a re-export layer.

## Data shapes and mapping chain

| Shape | Layer | Built by |
|---|---|---|
| Request DTO (class-validator) | presentation | `ValidationPipe` |
| Command / Query (data only) | application | controller, from the DTO |
| Entity / value object | domain | `Entity.create()` in the command handler, or `toX(record)` when loading |
| Prisma record | infrastructure | Prisma |
| View (read model, interface) | application | `toXView(entity)` next to the query |
| Response DTO | presentation | `toXResponse(view)` in `presentation/mappers/` |

- Read: record -> entity -> view -> response (`home`).
- Read through a query repository (`project` list): record -> read model -> view -> response. The port `XQueryRepository` lives in `domain/repositories/` and returns a plain read-model interface from `domain/read-models/` (no Prisma import; Prisma's `select` result is structurally assignable). No entity is built, so only the needed columns are loaded.
- Write: DTO -> command -> entity -> record.

The view/response split is deliberate. The extra mapping keeps `application/` free of presentation types. Query handlers return views, never response DTOs. When a view and its response have the same shape, the mapping is still kept so the HTTP contract can change without touching the application layer.

## Where validation lives

| | Request DTO (presentation) | Domain (entity / value object) |
|---|---|---|
| Question | "Can I read this request?" | "Is this a valid business object?" |
| Checks | Types, required or optional, nesting, cheap size bounds | Business invariants: ranges, formats, uniqueness, counts, cross-field rules |
| Runs | Only for HTTP requests | Every time the object is built: any caller, and when loading from the database |
| Reports | All errors at once (`ValidationPipe`), HTTP 400 | First error only, `DomainError` (kind `invalid`, HTTP 400) |
| Authority | A convenience and part of the API contract | The source of truth |

Rules of thumb:

- Test: "If a script called `Entity.create()` with no HTTP layer, must this rule still hold?" Yes: it belongs in the domain.
- Every business rule lives in the domain. The DTO may repeat it for an early, complete 400, but a DTO-only business rule is a defect.
- Rules that need the database (for example "name is unique") belong in the command handler plus a database constraint, not in the DTO or the entity.
- A rule about one image belongs in the `ProjectImage` value object; a rule about the whole collection (count, uniqueness) belongs in the aggregate (`Project`).
- Share limits through exported domain constants (`PROJECT_MAX_IMAGES`) so the two layers cannot drift. Keep both layers covered by tests.
- Limits must also respect the database column types (length, integer range). A value the database rejects surfaces as HTTP 500.

## Ports and wiring

- A port is an `abstract class` in `domain/` and doubles as the DI token: `{ provide: XRepository, useClass: PrismaXRepository }`.
- Every command, query and event handler is listed in the feature module's `providers`.
- `CqrsModule.forRoot()` is imported once, in `AppModule`; it is global.

## Transactions

A command handler that must write several times atomically wraps the writes in `TransactionManager.run`.

| Piece | Where | Role |
|---|---|---|
| `TransactionManager` (abstract class) | `src/shared/domain/transaction/transaction-manager.ts` | Port: `run(callback)`; the handler depends only on this |
| `runInTransaction`, `getTx` | `src/shared/domain/transaction/transaction-context.ts` | `AsyncLocalStorage` that carries the current `tx`; Node only, no Prisma or Nest |
| `PrismaTransactionManager` | `src/database/prisma-transaction-manager.ts` | Opens `prisma.$transaction`, puts `tx` in the context, runs the callback; Prisma commits or rolls back |
| Repository getter `db` | `infrastructure/repositories/prisma-*.repository.ts` | `getTx<Prisma.TransactionClient>() ?? this._prisma` |

Rules:

- Pass a function to `run`, never its result: `run(() => repository.save(x))`, with no `await` inside the parentheses. The work must start after `BEGIN`.
- Every repository method that takes part in a transaction reads its client through the `db` getter. A method that uses `this._prisma` directly writes outside the transaction without any error.
- Publish events after `run` returns, so they only go out once the data is committed. The default `EventBus` does not wait for handlers and swallows their errors; an event published inside the callback can run after the transaction has closed.
- Wrap in one place only (the handler). Do not also wrap at a bus: Prisma would open two separate transactions.
- A single nested write (for example a project with its images) is already atomic in Prisma; `run` matters from the second repository call on.
- Provider classes need `@Injectable()`; without a decorator Nest passes no constructor arguments and the dependency is `undefined` at runtime.

## Shared code

- `src/database/`: global `DatabaseModule`, `PrismaService`, `PrismaTransactionManager`.
- `src/shared/domain|application|presentation/`: base errors (`DomainError`, `ApplicationError`, `PresentationError`), `Role`, guards, `@Roles`, `GlobalExceptionFilter`, `ResponseDto`, request context.
- `src/lib/utils/`: small pure helpers (`isBlank`, `isHttpsUrl`, `isPresent`).

## Testing

No tests exist yet. When added, test handlers with an in-memory implementation of the port and no database.
