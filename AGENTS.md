# Agent Guidelines

- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.
- The default branch in this repo is `dev`.
- Local `main` ref may not exist; use `dev` or `origin/dev` for diffs.
- Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.

---

## Build/Lint/Test Commands

### Root Commands

```bash
bun typecheck              # Type-check all packages (via turbo)
bun run dev                # Run opencode CLI dev mode
bun run dev:web            # Run web app dev server
bun run dev:desktop        # Run Tauri desktop app
bun run dev:console        # Run console app
```

### Package-specific Commands (run from package directory)

#### packages/opencode

```bash
bun run typecheck          # Type-check (tsgo --noEmit)
bun run test               # Run tests (bun test --timeout 30000)
bun run dev                # CLI dev mode
bun run db generate        # Generate Drizzle migration (bun drizzle-kit generate)
bun run db push            # Push schema changes (bun drizzle-kit push)
```

#### packages/app

```bash
bun run typecheck          # Type-check (tsgo -b)
bun run dev                # Vite dev server
bun run build              # Production build
bun run test:unit          # Unit tests (bun test --preload ./happydom.ts ./src)
bun run test:unit:watch    # Unit tests in watch mode
bun run test:e2e           # Playwright e2e tests
bun run test:e2e:local     # Local e2e tests
bun run test:e2e:ui        # E2e tests with UI
bun run test:e2e:report    # Show e2e report
```

#### packages/desktop

```bash
bun run typecheck
bun run dev                # Vite dev (uses predev script)
bun run build              # Build with typecheck + vite build
```

#### packages/desktop-electron

```bash
bun run typecheck
bun run dev                # electron-vite dev
bun run build              # electron-vite build
bun run package:win        # Build Windows installer
bun run package:mac        # Build macOS app
bun run package:linux      # Build Linux app
```

#### packages/console/app

```bash
bun run typecheck
bun run dev                # Vite dev server
bun run build              # Full build with schema generation
```

### Testing Rules

- Tests **cannot run from repo root** (guard: `do-not-run-tests-from-root`)
- Run tests from package directories: `cd packages/opencode && bun run test`
- Avoid mocks; test actual implementation
- Single test: use `bun test --timeout 30000 <path>` in the package dir

### Type Checking

- Always use `bun run typecheck` or `tsgo` directly, **never `tsc` directly**
- Most packages use `tsgo --noEmit`, some use `tsgo -b` (build mode)

---

## Code Style Guidelines

### General Principles

- Keep things in one function unless composable or reusable
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Prefer single word variable names where possible
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference; avoid explicit type annotations unless necessary for exports or clarity
- Prefer functional array methods (`flatMap`, `filter`, `map`) over for loops
- Use type guards on `filter` to maintain type inference

### Naming

**MANDATORY RULE**: Use single word names by default for new locals, params, and helper functions.

Multi-word names allowed only when a single word would be unclear or ambiguous. Good short names: `pid`, `cfg`, `err`, `opts`, `dir`, `root`, `child`, `state`, `timeout`.

```ts
// Good
const foo = 1
function journal(dir: string) {}

// Bad
const fooBar = 1
function prepareJournal(dir: string) {}
```

Reduce variable count by inlining when a value is only used once:

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### Imports

Group imports logically:

```ts
import path from "path"
import fs from "fs/promises"
import { createWriteStream } from "fs"
import { Global } from "../global"
import z from "zod"
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context:

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassignment:

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### Control Flow

Avoid `else` statements. Prefer early returns:

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Error Handling

Use the `@opencode-ai/util` error utilities:

```ts
import { NamedError } from "@opencode-ai/util/error"

// Define error types with schemas
export const MyError = NamedError.create(
  "MyError",
  z.object({
    message: z.string(),
  }),
)

// Use in code
throw new MyError({ message: "Something went wrong" })
```

### Schema Definitions

**Drizzle (snake_case)**: Use snake_case for field names so column names don't need to be redefined:

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

**Zod**: Use `z.object()` for data schemas, `Schema.Class` for multi-field data in Effect code, and `Schema.brand` for single-value types.

### Effect Framework (packages/opencode)

When working with Effect:

- Use `Effect.gen(function* () { ... })` for composition
- Use `Effect.fn("Domain.method")` for named/traced effects
- Use `Effect.callback` for callback-based APIs
- Use `Schema.TaggedErrorClass` for typed errors
- Prefer `DateTime.nowAsDate` over `new Date()` when needing a `Date`
- Use `Instance.bind(fn)` for native addon callbacks that need ALS context

### Formatting

Prettier config (from root `package.json`):

```json
{
  "semi": false,
  "printWidth": 120
}
```

Use default Bun/Prettier formatting. Run `bun run --prettier --write` for formatting.

### SolidJS (packages/app)

- Always prefer `createStore` over multiple `createSignal` calls
