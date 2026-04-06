# CLAUDE.md — NexusAI Project Guide

This file is the primary context document for Claude Code working in the NexusAI monorepo. Read this before touching any file.

---

## 🗺️ What Is NexusAI?

NexusAI is a **full-stack AI model discovery and agent deployment platform**. Users can:
- Browse and compare 525+ foundation models (OpenAI, Anthropic, Google, Meta, etc.)
- Deploy pre-built AI agent blueprints for business, research, and content tasks
- Read curated AI research breakthroughs with live model references
- Sign up and manage a personalised workspace

---

## 📐 Monorepo Layout

```
d:\NexAi\
├── frontend/          ← Next.js 15 (App Router) — runs on port 3000
├── backend/           ← Express.js v5 — runs on port 3001
└── .claude/
    ├── agents/        ← Specialised Claude sub-agents
    └── skills/        ← Deep-reference skill documents
```

---

## 🤖 Agents & Skills

Use the correct agent for each task type:

| Task | Agent to invoke |
|---|---|
| Backend API, DB, auth, Express.js | `backend-agent` |
| Frontend pages, components, UX | `frontend-planner-agent` |
| Writing / running / fixing tests | `tester-agent` |

Each agent has a companion skill in `.claude/skills/` with copy-paste patterns. Load the relevant skill before writing code.

---

## 🔧 Development Environment

```bash
# Backend — Express dev server with nodemon hot-reload
cd backend && npm run dev    # http://localhost:3001

# Frontend — Next.js dev server
cd frontend && npm run dev   # http://localhost:3000

# Start PostgreSQL (Docker)
cd backend && npm run docker:up
```

---

## 🌐 Frontend Architecture

### Framework
- **Next.js 15 App Router** — file-based routing under `frontend/src/app/`
- `'use client'` directive only on files that use hooks or browser APIs

### Pages
| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, featured models, trending news, agents |
| `/chat` | `app/chat/page.tsx` | AI chat hub |
| `/marketplace` | `app/marketplace/page.tsx` | Full model catalogue + detail modal |
| `/agents` | `app/agents/page.tsx` | Agent builder workspace |
| `/discover` | `app/discover/page.tsx` | Research feed (master-detail) |
| `/login` | `app/login/page.tsx` | JWT signin |
| `/signup` | `app/signup/page.tsx` | Account creation |

### State Management
- **Zustand** (`src/store/useStore.ts`): `user`, `setUser`, `logout`
- Auth tokens stored in cookies via `src/lib/cookies.ts`
- Session restored on load by `AuthInitializer` inside `Providers.tsx`

### Service Layer
All backend calls are centralised in `src/services/modelService.ts`:
```typescript
fetchAllModels()                      // GET /api/models
fetchAgents()                         // GET /api/agents
fetchResearchFeed()                   // GET /api/research-feed
fetchModelReferences(id: string)      // GET /api/research-feed/:id/model-references
```
**Never call `fetch()` directly in a page component** — always go through the service layer.

### Fallback Strategy
Every data-fetching block must catch errors and fall back to local JSON:
```typescript
} catch {
  setModels(localModelsData.slice(0, 3));  // graceful degradation
}
```

---

## 🎨 Design System Rules

### Typography
- Headings: `fontWeight: 900`, `letterSpacing: '-1px'` to `'-1.5px'`
- Body: `fontWeight: 500–600`, `lineHeight: 1.6`

### Colour Palette
```
#D46F35  — Primary orange (CTAs, active states)
#B3511D  — Dark orange (hover)
#111827  — Near-black (headings)
#4B5563  — Body text
#6B7280  — Muted text
#E5E7EB  — Borders (light)
#EDEDED  — Borders (subtle)
#F9FAFB  — Surface background
#FAFAFA  — Page background
#0F172A  — Dark sections (newsletter, footer)
```

### Border Radius
- **Max 2–3 MUI units** (≈ 8–12 px). Never use `borderRadius: 6` or higher on content cards.
- Pill buttons only for nav chips: `borderRadius: 999`.

### Navbar Offset
The global `<Navbar />` uses `position: fixed`. Every page **must** include `pt: '72px'` on its root container.

### Micro-Animations
```tsx
transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
'&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }
```

---

## 🔐 Backend Architecture (Express.js v5)

### Stack
- **Runtime**: Node.js CommonJS (`require/module.exports`) — **not ESM**
- **Framework**: Express v5 (`express@^5.2.1`)
- **Database**: PostgreSQL via `pg` Pool — raw SQL, no ORM
- **Auth**: `jsonwebtoken` + `bcryptjs`
- **Config**: `dotenv`

### Project Layout (`backend/`)
```
server.js              # Entry: app setup, CORS, route mount, DB health poll
routes/
  index.js             # Mounts dataRoutes (/) and authRoutes (/auth)
  authRoutes.js        # POST /create-account, /signin, /refresh-token, /logout | GET /me
  dataRoutes.js        # GET /models, /research-feed, /research-feed/:id, etc.
controller/
  authController.js    # createAccount, signIn, refreshToken, logout, me
  dataController.js    # reads data/*.json files
middleware/
  verifyJwt.js         # Bearer token extractor → sets req.user = { userId, email }
  requestLogger.js     # Request logger
db/
  pool.js              # pg Pool (host, port, user, password, database, family:4)
  init.sql             # DDL: CREATE TABLE users, refresh_tokens
data/
  models.json          # Foundation model catalogue
  research-feed.json   # Research items
  users.json           # Static fallback
utils/
  tokenUtils.js        # createAccessToken, createRefreshToken, getRefreshTokenExpiryDate
```

### Auth Flow
```
POST /api/auth/create-account   { fullName, email, password }   → 201 { message, user }
POST /api/auth/signin           { email, password }             → 200 { message, accessToken, refreshToken, user }
POST /api/auth/refresh-token    { refreshToken }                → 200 { message, accessToken, refreshToken }
POST /api/auth/logout           { refreshToken }                → 200 { message }
GET  /api/auth/me               (Bearer accessToken)            → 200 { user }
```

### Database Tables
```sql
users          (id SERIAL PK, full_name TEXT, email TEXT UNIQUE, password_hash TEXT, created_at TIMESTAMPTZ)
refresh_tokens (id SERIAL PK, user_id INT FK, token TEXT, expires_at TIMESTAMPTZ, is_revoked BOOL)
```

### Environment Variables (`backend/.env`)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=nexusai
ACCESS_TOKEN_SECRET=<random string>
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=<different random string>
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
```

### Adding a New Route — Checklist
1. Create `controller/<name>Controller.js` with async handlers
2. Create `routes/<name>Routes.js` — `require controller`, define routes
3. Register in `routes/index.js`: `router.use('/<name>', require('./<name>Routes'))`
4. Use raw SQL with `$1, $2…` — never string-interpolate user input
5. Every catch block checks `isDbConnected(req)` before returning 500

---

## 🔗 Key Cross-Cutting Concerns

### Deep Linking (Home → Research Feed)
Trending news cards on the Home page link to `/discover?id=<researchItemId>`. The Discover page reads `searchParams.get('id')` to pre-select the correct article.

### JSX Safety
Always escape special characters in JSX:
- `'` → `&apos;`
- `>` → `&gt;`
- `&` → `&amp;`

### Unused Imports
Remove all unused MUI/icon imports immediately — the linter flags them and they bloat the bundle.

---

## 📋 What Was Built

### Phase 1 — Foundation
- Express.js backend bootstrapped with PostgreSQL via `pg` Pool and raw SQL
- `auth` module: create-account, signin, refresh-token, logout, /me with JWT
- Refresh token rotation stored in DB (`refresh_tokens` table)
- Next.js 15 App Router frontend scaffolded with MUI v6 theming

### Phase 2 — Core Pages
- **Marketplace** (`/marketplace`): full model grid with `ModelDetailModal` (6 tabs)
- **Chat Hub** (`/chat`): conversation interface with model selector
- **Agent Builder** (`/agents`): workspace with sidebar, horizontally scrollable use-case tabs (with icons), filtered blueprint grid, quick-start suggestions
- **Research Feed** (`/discover`): master-detail layout with category filters, model reference linking, deep-link `?id=` support

### Phase 3 — Authentication
- Signup and Login pages wired to `/api/auth/*`
- `AuthInitializer` component restores session on page load via `GET /api/auth/me`
- Navbar dynamically toggles between user profile menu and Sign In/Sign Up

### Phase 4 — Home Page Enhancement
- Dynamic fetching: top 3 foundation models + top 4 AI agents from `data/*.json`
- Trending News section deep-links to Research Feed (`/discover?id=…`)
- Onboarding discovery modal with guided AI workspace setup
- Newsletter subscription with `Snackbar` confirmation toast
- "Find Models by Budget" tiered pricing section
- Flagship model comparison table
- Smooth scroll-to-top on footer links

### Phase 5 — DX & Quality
- Claude Code agents + skills added (`.claude/`)
- `README.md` and `CLAUDE.md` added at project root — accurate to Express.js stack
- Linting errors resolved (JSX escaping, unused imports, TypeScript `any`)
- Horizontal overflow fixed across Agent Builder and full-viewport layouts

---

## ✅ Coding Checklist

Before finishing any task, verify:

**Backend**
- [ ] Raw SQL uses `$1, $2…` (no string interpolation of user input)
- [ ] Every async handler has `try/catch` with `isDbConnected(req)` guard in catch
- [ ] New route registered in `routes/index.js`
- [ ] `npm run dev` starts without errors

**Frontend**
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No unused MUI imports
- [ ] `'` characters escaped as `&apos;` in JSX text
- [ ] New pages include `pt: '72px'` for Navbar offset
- [ ] Data fetching has a local JSON fallback
- [ ] `npm run dev` starts without errors
