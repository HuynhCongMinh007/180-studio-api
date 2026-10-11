# Module Architecture (Clean / Hexagonal / DDD)

Each feature lives in `src/modules/<feature>/` and is split into four layers. Reference implementation: `src/modules/home/`.

```text
src/modules/<feature>/
  domain/           entities, value objects, domain errors, repository ports
  application/      use cases (one class per use case, `execute()`)
  infrastructure/   adapters: Prisma repositories, record <-> entity mappers, external SDKs
  presentation/     controllers, request DTOs, response mappers
  <feature>.module.ts   wires ports to adapters
```

## Dependency rule

Dependencies point inward only: `presentation -> application -> domain <- infrastructure`.

- `domain/` imports nothing from Nest, Prisma, `src/generated`, or other layers. Invariants are enforced in entity factories (`Entity.create`) and throw domain errors.
- `application/` depends on domain entities and ports only. `@Injectable()` from `@nestjs/common` is the one accepted framework import.
- `infrastructure/` implements domain ports. Prisma record types never leave this layer; map them to entities in a mapper (for example, BIGINT `id` -> `number`).
- `presentation/` calls use cases, never repositories or `PrismaService`. It maps entities to the response contract; entities are never serialized directly.

## Ports and wiring

- A repository port is an `abstract class` in `domain/`, so it doubles as the Nest DI token.
- Bind it in the feature module: `{ provide: XRepository, useClass: PrismaXRepository }`.
- Test use cases and controllers with an in-memory implementation of the port, with no database.

## Shared code

- `src/database/` (global `PrismaService`) and `src/common/` (guards, filters, interceptors) are shared infrastructure, not feature modules.
- Routes and payloads still follow `docs/specs/BE_NESTJS_REBUILD_SPEC.md` §8; the folder layout does not change the API contract.
