# NexusAI

> **The benchmark for AI reliability.** Discover, compare, and deploy foundation models and autonomous AI agents from a single, unified platform.

---

## 🌐 Live Stack

| Layer | Tech | Port |
|---|---|---|
| Frontend | Next.js 15 · React 18 · Material UI v6 · Zustand | `3000` |
| Backend | Express.js v5 · PostgreSQL (`pg`) · JWT | `3001` |

---

## 📁 Repository Structure

```
nexai/
├── frontend/                  # Next.js 15 App Router application
│   └── src/
│       ├── app/               # Pages: Home, Chat, Marketplace, Agents, Discover, Login, Signup
│       ├── components/        # Shared UI: Navbar, ModelCard, ModelDetailModal, …
│       ├── services/          # modelService.ts — centralised backend API calls
│       ├── store/             # Zustand global state (user session)
│       ├── lib/               # cookies.ts, api.ts
│       ├── i18n/              # Multi-language support (14 languages)
│       └── data/              # Local JSON fallbacks (models.json, discover_feed.json)
│
├── backend/                   # Express.js v5 REST API
│   ├── server.js              # Entry point — app, CORS, middleware, routes, DB health poll
│   ├── routes/
│   │   ├── index.js           # Mounts authRoutes (/auth) and dataRoutes (/)
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── dataRoutes.js      # Data endpoints
│   ├── controller/
│   │   ├── authController.js  # createAccount, signIn, refreshToken, logout, me
│   │   └── dataController.js  # Serves data/*.json — models, research feed, etc.
│   ├── middleware/
│   │   ├── verifyJwt.js       # Bearer token extractor → sets req.user
│   │   └── requestLogger.js   # Logs incoming requests
│   ├── db/
│   │   ├── pool.js            # pg Pool connection
│   │   └── init.sql           # DDL: users, refresh_tokens tables
│   ├── data/
│   │   ├── models.json        # Foundation model catalogue
│   │   ├── research-feed.json # Research breakthroughs
│   │   └── users.json         # Static fallback users
│   └── utils/
│       └── tokenUtils.js      # createAccessToken, createRefreshToken, getRefreshTokenExpiryDate
│
└── .claude/                   # Claude Code agent & skill definitions
    ├── agents/
    │   ├── backend-agent.md
    │   ├── frontend-planner-agent.md
    │   └── tester-agent.md
    └── skills/
        ├── backend-skill.md
        ├── frontend-skill.md
        └── tester-skill.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Docker Desktop (for PostgreSQL) **or** a local PostgreSQL instance
- `npm`

### 1. Clone

```bash
git clone https://github.com/Muhammad-Taha-Hussain056/nexus-ai.git
cd nexus-ai
```

### 2. Start the Database

```bash
cd backend
npm run docker:up    # starts postgres via docker-compose.yml
```

### 3. Configure Environment

Create `backend/.env` (copy from `backend/.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=nexusai
ACCESS_TOKEN_SECRET=your-access-secret-here
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-refresh-secret-here
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
```

### 4. Install Dependencies & Run

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Core Features

| Feature | Description |
|---|---|
| **Model Discovery** | Browse 525+ foundation models with live pricing, context window, and capability data |
| **AI Agent Builder** | Configure and deploy autonomous agent blueprints across 6 use-case categories |
| **Research Feed** | Curated AI breakthroughs with deep-link navigation from the Home news section |
| **Model Comparison** | Flagship model comparison table with speed, pricing, and benchmark data |
| **Authentication** | JWT access + refresh token auth with token rotation and persistent sessions |
| **Onboarding Flow** | Guided discovery wizard that generates a tailored AI workspace |
| **Budget Tiers** | Filter models by cost: Free → Under $0.50/1M → Mid-Range → Premium |
| **Multi-Language** | 14 language selector (EN, AR, FR, DE, ES, PT, ZH, JA, KO, HI, UR, TR, RU, IT) |

---

## 🔌 API Reference

### Auth (`/api/auth`)

| Method | Endpoint | Body | Auth | Response |
|---|---|---|---|---|
| POST | `/create-account` | `{ fullName, email, password }` | None | `201 { message, user }` |
| POST | `/signin` | `{ email, password }` | None | `200 { message, accessToken, refreshToken, user }` |
| POST | `/refresh-token` | `{ refreshToken }` | None | `200 { message, accessToken, refreshToken }` |
| POST | `/logout` | `{ refreshToken }` | None | `200 { message }` |
| GET | `/me` | — | Bearer | `200 { user }` |

### Data (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/models` | All foundation models from `data/models.json` |
| GET | `/models/changes` | Model changelog array |
| GET | `/research-feed` | Full research feed (`{ feedTitle, items }`) |
| GET | `/research-feed/:id` | Single research item by ID |
| GET | `/research-feed/:id/model-references` | Model details cross-referenced from the research item |

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Refresh tokens (rotation-based)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE
);
```

---

## 🧪 Testing

```bash
# Backend unit & integration tests
cd backend && npm test
cd backend && npm run test:coverage

# Frontend component tests
cd frontend && npm run test
cd frontend && npm run test -- --coverage
```

---

## 🏗️ Design System

- **Primary colour**: `#D46F35` (NexusAI Orange)
- **Typography**: Inter / system-ui, weights 500–900
- **Border radius**: Max 12 px (`borderRadius: 2` in MUI units) — no "bubbly" shapes
- **Animations**: `cubic-bezier(0.4, 0, 0.2, 1)` at 200 ms for card hover lifts
- **Dark sections**: `#0F172A` background (newsletter, footer)

---

## 👤 Author

**Muhammad Taha Hussain**
- GitHub: [@Muhammad-Taha-Hussain056](https://github.com/Muhammad-Taha-Hussain056)

---

## 📄 License

MIT © 2026 NexusAI Inc.
