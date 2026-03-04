# Project Coding Guide (Vite + React + TypeScript + Tailwind + React Router + TanStack Query)

## Goals
- Readable, consistent, low-drama code.
- Fast iteration for a dashboard app.
- Clear separation: UI (presentational) vs feature (data + orchestration).
- TypeScript is a safety net, not a religion.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- TanStack Query (React Query)

---

## Formatting & Linting
- Use Prettier + ESLint.
- 4-space indentation.
- Prefer single quotes in TS/JS.
- No semicolons (Prettier default) OR semicolons everywhere — pick one and stay consistent (default: no semicolons).
- Keep lines readable; break long JSX props onto multiple lines.

---

## Naming Conventions
- Components: `PascalCase` (e.g., `UserCard.tsx`)
- Pages (routes): `PascalCase` under `pages/` (e.g., `DashboardPage.tsx`)
- Hooks: `useThing` (e.g., `useUser.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Types: `PascalCase` (e.g., `User`, `GameLog`)
- Constants: `UPPER_SNAKE_CASE` for true constants only
- Booleans: `isLoading`, `hasError`, `canEdit`

---

## Folder Structure
Use feature-slices to keep code scalable:

.
  .env.local              # local environment variables (never commit secrets)
  eslint.config.js
  index.html
  README.md
  package.json
  package-lock.json
  postcss.config.js
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  style_guide.md
  public/
    vite.svg
  src/
    assets/
      default-skater.png
      react.svg
    index.css
    main.tsx
    app/
      router.tsx          # routes + layouts
      providers.tsx       # QueryClientProvider, RouterProvider, etc.
    pages/                # route-level pages (thin)
      DashboardPage.tsx
      PlayerPage.tsx
    features/
      api.ts              # feature-level query functions
      queries.ts          # feature-level TanStack Query hooks
      types.ts            # feature-level shared types
      teamNames.ts        # NHL team code -> display name mapping
      player/
        components/
          PlayerCard.tsx
          PlayerSnapshot.tsx
      stats/
        components/
          StatTable.tsx
        utils.ts
      team/
        components/
          TeamCard.tsx
          TeamSnapshot.tsx
    components/
      ui/                 # reusable presentational components
        Tabs.tsx
      layout/             # AppShell, Sidebar, Topbar
        AppShell.tsx
    lib/
      apiClient.ts        # low-level fetch wrapper
      api.ts              # feature-facing API helpers
      queryClient.ts      # QueryClient config
      cn.ts               # className helper
    types/                # shared cross-feature types (keep small)
    styles/               # globals (rare)

Rules:
- Pages are thin: assemble feature components, don’t contain heavy logic.
- Feature-layer modules own API/types/query keys/components (`src/features/*`), either as shared files or per-feature subfolders.

---

## TypeScript Rules (Pragmatic)
- Prefer `type` over `interface` unless you specifically need declaration merging.
- Type all component props.
- Type all API responses (or validate them).
- Avoid `any` except at boundaries (3rd party libs / messy API), and isolate it.
- Don’t over-model: keep types simple and close to real data shapes.

---

## React Component Rules
- Function components only.
- One primary component per file.
- Keep files ~200 lines (soft limit). Split into subcomponents/hooks when needed.
- Default pattern:
  - `components/ui/*` = dumb/presentational
  - `features/*` = fetching + orchestration + domain logic

### Props
- Prefer explicit prop types.
- Prefer passing primitives/IDs over passing entire objects when it reduces rerenders.
- Avoid prop drilling more than ~2 levels:
  - Lift state sensibly
  - Use context sparingly (auth/theme/query client)

---

## State Management
- Local UI state: `useState` / `useReducer`.
- Derived state: compute from existing state/props (don’t store duplicates).
- Server state (API): TanStack Query.
- Global state (client-only): only if necessary; prefer feature-local state.

---

## Side Effects (useEffect)
Use `useEffect` only for:
- subscriptions
- imperative integrations (charts, DOM APIs)
- syncing to external systems (localStorage, analytics)

Avoid `useEffect` for:
- fetching (use TanStack Query instead)
- derived state

Always:
- include correct dependencies
- use abort signals for manual fetches if needed

---

## Routing (React Router)
- Routes defined in `src/app/router.tsx`.
- Use a layout component (AppShell) for the dashboard:
  - Sidebar + Topbar + Content outlet
- Pages in `src/pages/*` should mostly render feature components.

---

## Data Fetching (TanStack Query)
- All network calls go through `src/lib/apiClient.ts`.
- Each feature defines:
  - query keys
  - query functions
  - typed response shapes

Patterns:
- Query keys live in `src/features/queries.ts` (or `src/features/<feature>/queries.ts` as feature slices grow)
- Mutations invalidate relevant queries.
- Always handle loading/error/empty states in UI.

Standard UI states:
- Loading → skeleton/spinner
- Error → message + retry
- Empty → empty state
- Success → render data

---

## API Client Rules
- No direct `fetch()` inside components.
- Centralize base URL, headers, and error handling.
- Normalize errors to a consistent shape:
  - `message`
  - `status`
  - optional `details`

---

## Tailwind Style Rules
- Prefer consistent spacing scale (2, 3, 4, 6, 8…).
- Extract reusable UI patterns into components:
  - `Button`, `Card`, `Input`, `Badge`, `Modal`
- Use `className` composition helper (e.g., `cn()`) for conditional classes.
- Avoid huge class strings in pages—move into components.

Recommended conventions:
- Layout: pages use `max-w-*`, `mx-auto`, `p-*`, `gap-*`
- Cards: `rounded-xl`, `border`, `bg-white`, `shadow-sm` (or consistent alternatives)
- Don’t invent random pixel values unless necessary.

---

## Error Handling & Logging
- Handle errors near the UI boundary (page/feature component).
- Don’t `console.log` in committed code except for temporary debugging.
- Prefer a small `logger` wrapper if needed later.

---

## Testing (Lightweight)
- Utilities: unit tests (Vitest)
- Critical flows: React Testing Library
- Focus on “critical path” not 100% coverage.

---

## Git / PR Hygiene
- Small, focused commits:
  - `feat: add shots dashboard table`
  - `fix: handle empty API response`
  - `refactor: extract Card component`
- Keep PRs scoped; avoid “mega changes”.

---

## What I want from ChatGPT for this project
- Default to these rules without asking.
- Provide production-ready code with file paths.
- Keep patterns consistent across files.
- Prefer simple solutions first; don’t introduce new libraries unless clearly helpful.
- When adding a library, include install command + minimal config.

---

## AI Guardrails (Project Invariants)
Treat these as hard constraints unless explicitly overridden:
- No direct `fetch()` calls in components, pages, or feature hooks; use `src/lib/apiClient.ts` (or helpers in `src/lib/api.ts`).
- Keep route pages thin (`src/pages/*`): compose feature components and handle page-level layout only.
- Keep domain logic, query keys, query functions, and API parsing inside feature folders (`src/features/*`).
- Reuse existing utilities/components before creating new abstractions.
- Do not add new dependencies unless asked or clearly necessary to complete the task.

Default placement rules for new code:
- New API/domain behavior -> `src/features/api.ts` + `src/features/queries.ts` + `src/features/types.ts` (or promote to `src/features/<feature>/*` when larger)
- Reusable view-only component -> `src/components/ui/*`
- Shared app shell/layout piece -> `src/components/layout/*`
- Cross-feature utility -> `src/lib/*`

---

## Environment & Config Context
- Current env var:
  - `VITE_API_BASE_URL` -> API base URL used by the client
- Environment variable usage:
  - Read with `import.meta.env`
  - Never hardcode host URLs in components
  - Never commit secrets/tokens to source control
- Source-of-truth config files:
  - Vite/build config: `vite.config.ts`
  - Router config: `src/app/router.tsx`
  - Query client defaults: `src/lib/queryClient.ts`
  - API transport/error normalization: `src/lib/apiClient.ts`

---

## Data Contract Expectations
- All feature API layers should return typed data (or explicitly validated/normalized data).
- Normalize request failures to a consistent shape:
  - `message: string`
  - `status?: number`
  - `details?: unknown`
- UI must always account for these states:
  - Loading
  - Error (with retry where sensible)
  - Empty
  - Success
- Prefer explicit date/time handling; avoid implicit locale parsing in rendering logic.

---

## Definition Of Done (For AI Changes)
A task is not complete unless all applicable checks pass:
- Code follows folder and ownership rules in this guide.
- New/changed behavior is typed and integrated with existing query/API patterns.
- Loading/error/empty UI states are handled for data-driven views.
- Existing lint/build checks pass, or failures are called out with exact reason.
- Changes are minimal and scoped; unrelated files are not modified.

---

## AI Response Contract
When returning implementation work, use this structure:
- `Summary`: what changed and why (1-3 bullets)
- `Files Changed`: explicit paths
- `Validation`: commands run + outcome (`pass`/`fail`/`not run`)
- `Notes`: assumptions, tradeoffs, or follow-up risks

Also:
- Reference files with paths (and line numbers when relevant), e.g. `src/lib/api.ts:12`.
- If blocked, state the blocker clearly and provide the next best actionable step.

---

## Recommended Prompt Prefix (Optional)
Use this before task-specific asks to improve consistency:

"Follow `style_guide.md` as the source of truth. Respect folder ownership and API/query patterns. Keep diffs minimal, avoid new dependencies, and include Summary, Files Changed, Validation, and Notes in your response."
