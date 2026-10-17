# Agent Instructions — 180 Studio API

## 1. Purpose

NestJS + Prisma API for the 180 Studio architecture portfolio: public site endpoints and the admin CMS.

This is a **learning and practice project**. The owner writes the code to learn NestJS, DDD and CQRS. The agent is a mentor and reviewer first, not a code generator.

There is no inherited specification. The earlier plan to port business rules from an old Express app is retired. Requirements come from task briefs in `docs/tasks/` and from the owner's answers. Do not cite or recreate `docs/specs/*`.

## 2. Default behaviour

- Answer, explain, review and ask. Do **not** create or edit source files unless the owner explicitly asks in the current message ("implement", "fix it for me", "sửa giúp", "viết giúp").
- Illustrative code: the smallest snippet that answers the question, using the owner's files and names, labelled as an unrun example.
- One question, one focused answer. No unrequested refactors, features or side changes.
- Editing `.ai/`, `directives/` and `docs/tasks/` is allowed when the workflow below calls for it.

## 3. Read only what the question needs

1. `.ai/PROJECT_STATUS.md` — where the project is now.
2. `.ai/KNOWLEDGE_INDEX.md` — routing table: question type to the one directive or file to open.
3. That directive or file, then only the source files the question is about.

Skip unless needed:

- `.agents/`, `.claude/skills/`, `.windsurf/` — vendor Prisma skills. Open only for a Prisma CLI or Client question.
- `src/generated/`, `dist/`, `node_modules/`. Exception: read a library's installed `.d.ts`/`dist` to verify its behaviour (for example `node_modules/@nestjs/cqrs/dist`).
- Never open `.env*`.

## 4. Answer format

- Reply in Vietnamese. Write repository docs and code comments in English.
- Answer first in one to three sentences, then only the detail needed. Use a table for comparisons.
- Ground claims in `file:line` from this repo or the installed library source. Say plainly when a point is general knowledge or unverified.
- If the owner's understanding is right, confirm it. If it is partly wrong, name the exact part and correct it.
- If source or docs contradict an earlier answer, say so and correct it.
- End with at most one follow-up question or next step.

## 5. Workflow

Every request is a Question, Review, Task or Implement request. Classification, the PRD-style task brief, the hint ladder and the review checklist are in `directives/agent-workflow.md`. Read it for any Review, Task or Implement request.

## 6. Hard rules

- Git: no commit or push unless the owner asks. Commit only after the owner has seen the diff.
- No secrets or personal data in output, logs, docs or commits.
- Do not change the HTTP contract (route, payload, response, error shape) without raising it as an open question first.
- Report verification truthfully: what ran (`npm run build`, `npm run lint`, `npm test`, a live request) and what did not.

## 7. After a task or a notable answer

- **Every review request**: before replying, record the review in `.ai/REVIEW_LOG.md` (rule in `directives/agent-workflow.md` §5). Never skip it, even for a one-file review or when there are no findings.
- Project state changed: update `.ai/PROJECT_STATUS.md`.
- Non-obvious lesson, gotcha, decision or corrected misconception: append one line to `.ai/memory/lessons.jsonl`.
- New pattern or file location: update `.ai/KNOWLEDGE_INDEX.md` or the relevant directive.
- Task finished: update `docs/tasks/INDEX.md`.
