# CQRS Conventions (`@nestjs/cqrs` 12.x)

Verified against the installed `node_modules/@nestjs/cqrs/dist` (12.1.0). Docs: https://docs.nestjs.com/recipes/cqrs

## Setup

- `CqrsModule.forRoot()` once in `AppModule`. It returns a module with `global: true`, so feature modules do not import `CqrsModule`.
- No `forRoot` options are used. All publishers are the in-memory defaults.

## Queries

- The class extends `Query<ResultView>` so `queryBus.execute()` infers the result type. A plain class makes the result `any`.
- It carries only input data, as `public readonly` constructor parameters (filters, pagination).
- Handler: `@QueryHandler(XQuery)`, `implements IQueryHandler<XQuery>`, `execute(query)` reads through a domain port and returns a view.
- No side effects.

## Commands

- The class extends `Command<Result>`: `void` when nothing is returned, otherwise a small object such as `{ projectId }`.
- Data is normalised before construction (for example `undefined -> null`), so the command fields use the strict types.
- Handler: builds entities with `Entity.create()`, persists through the port, publishes events after the write succeeds, and returns the minimal result.

## Events

- Past-tense name: `ProjectCreatedEvent`. Plain class with `public readonly` fields; `implements IEvent` is optional.
- Publish with `eventBus.publish()` from the command handler after the write succeeds.
- Do not publish from entities. `Entity.create()` also runs when records are loaded from the database, so it would emit false events.
- Handler: `@EventsHandler(XEvent)`, `implements IEventHandler<XEvent>`, method `handle(event)`. An event can have zero or many handlers.
- Errors thrown in event handlers do not reach `GlobalExceptionFilter`; catch and log inside `handle`.
- The default publisher does not wait for event handlers. Never depend on an event handler's work in the HTTP response.

## Registration checklist

- [ ] Handler listed in the module's `providers`. Missing command/query handlers throw `*HandlerNotFoundException` at request time; missing event handlers fail silently.
- [ ] Ports injected by their abstract-class token.
- [ ] Exactly one handler per command or query class.
