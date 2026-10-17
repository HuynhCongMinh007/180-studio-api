# Agent Workflow — Question, Review, Task, Implement

The goal is to help the owner learn by building. Prefer questions, briefs and reviews over generated code.

## 1. Classify the request

| Type | Signal | Output |
|---|---|---|
| Question | "là gì", "tại sao", "như thế nào", pasted docs or code with a question | Answer (AGENTS.md §4) |
| Review | "review", "ổn chưa", the owner's finished code | Findings (§5), no edits |
| Task | A feature, bug or refactor to do, without "do it for me" | Clarify, then brief (§3) |
| Implement | Explicit request to write or fix code | Minimal change, verify, report (§6) |

If the type is unclear, treat it as a Question and ask one clarifying question.

## 2. Answering questions

- Explain at the depth asked; go deeper only when the owner asks.
- Tie concepts to this repo. `src/modules/project` is the CQRS reference (query, command, event); `src/modules/home` is the query-with-view reference.
- For library behaviour, read the installed version's `.d.ts` or `dist` before asserting.
- Separate runtime phases when it helps: definition (decorators and metadata), bootstrap (DI, handler registration), request (`execute`/`handle`).
- Pasted documentation: map each example to the matching file in this repo.

## 3. Task brief (PRD-style)

Before writing a brief, ask at most three clarifying questions, each with a recommended default. Then write the brief with `docs/tasks/_TEMPLATE.md`:

1. Problem and why: what is missing and why it matters.
2. Goal: the outcome in one sentence.
3. Scope and non-goals: what is in, and what is explicitly out.
4. Requirements: numbered, testable statements.
5. Acceptance criteria: Given/When/Then, including error cases.
6. HTTP contract: route, auth, request, response, errors, or "no contract change".
7. Learning goals: the concepts the owner will practise.
8. Hints: files and patterns to look at, not code.
9. Open questions.

Save it as `docs/tasks/T-xxx-<slug>.md` and add a row to `docs/tasks/INDEX.md` only after the owner agrees. A brief the agent proposes on its own is marked `Proposed`.

## 4. While the owner implements: hint ladder

Give the lowest rung that unblocks. Climb only when the owner asks or is still stuck.

1. Concept: name the idea and why it applies.
2. Pointer: the file or pattern in this repo, or the docs section.
3. Shape: signatures, types or pseudo-code.
4. Snippet: a small example, labelled unrun.
5. Implement: only on explicit request (§6).

## 5. Review checklist

Rank findings: **Blocking** (does not compile or run, wrong behaviour, missing DI registration), then **Rule** (breaks a directive), then **Minor** (naming, style, typos).

Check in this order:

1. Acceptance criteria of the brief, if one exists.
2. Wiring: handler in the module's `providers`; `CqrsModule.forRoot()` only in `AppModule`; port bound to its adapter.
3. Layer rule and mapping chain: `directives/architecture.md`.
4. CQRS conventions: `directives/cqrs.md`.
5. Types: optional DTO fields typed `?:`; `Command<T>`/`Query<T>` match the handler's return type.
6. Naming and typos: `directives/code-style.md`.

Report what is right, the ranked findings, and what was not verified (app not started, no tests). Do not fix unless asked.

### Review log (mandatory, automatic)

On every review request, write the result to `.ai/REVIEW_LOG.md` **before** replying. This is how findings are not missed.

1. Start by reading the log. Carry forward every `Open` finding from earlier reviews into the scope of this review.
2. Append a new section at the top: date, scope (files or task id), verification run (`npm run build`, `npm run lint`, `npx prettier --check`, tests, live request) and what was not run.
3. One row per finding: ID (`R-<date>-<n>`), severity (Blocking, Rule, Minor), file and line, one-line description, status.
4. Status values: `Open`, `Fixed` (verified in a later review), `Won't fix` (the owner decided; note why).
5. When a later review finds an earlier finding resolved, flip it to `Fixed` and note the date. Do not delete rows.
6. Keep `.ai/PROJECT_STATUS.md` "Known debt" in sync with open Blocking and Rule findings.
7. If the review belongs to a task brief, add a one-line summary to its "Review notes" and update `docs/tasks/INDEX.md`.

## 6. Implement

- Change only what was asked. Match the style of the file being edited.
- Run `npm run build` and `npx oxlint <changed paths>`; run tests when they exist.
- Report the files changed, the verification run, and anything still unverified.
