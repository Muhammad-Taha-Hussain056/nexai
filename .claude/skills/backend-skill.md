---
name: backend-skill
description: Deep reference skill for the NexusAI Express.js backend — route/controller patterns, raw SQL with pg Pool, JWT auth middleware, JSON data serving, and error handling. Load this skill before writing any backend code.
---

# NexusAI Backend Skill (Express.js)

## 1. Project Startup

```bash
cd backend
npm run dev          # nodemon server.js → http://localhost:3001
npm start            # node server.js (production)
npm run docker:up    # Start PostgreSQL via Docker Compose
npm run docker:down  # Stop containers
```

## 2. Adding a New Feature — Step-by-Step

### Step 1 — Create the controller

```js
// controller/agentController.js
const path = require('path');
const fs   = require('fs');

const dataDir = path.resolve(__dirname, '..', 'data');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
}

function getAgents(req, res) {
  try {
    const { agents } = readJson('agents.json');
    return res.json({ agents: agents || [] });
  } catch (err) {
    console.error('[agents] getAgents error:', err.message);
    return res.status(500).json({ message: 'Failed to load agents' });
  }
}

module.exports = { getAgents };
```

### Step 2 — Create the route file

```js
// routes/agentRoutes.js
const express = require('express');
const { getAgents } = require('../controller/agentController');

const router = express.Router();

// GET /api/agents — returns all agent templates
router.get('/', getAgents);

module.exports = router;
```

### Step 3 — Register in routes/index.js

```js
const agentRoutes = require('./agentRoutes');
router.use('/agents', agentRoutes);
```

---

## 3. Protected Route (JWT)

```js
const verifyJwt = require('../middleware/verifyJwt');

// Only authenticated users can access this route
router.post('/create', verifyJwt, createHandler);

// Inside the handler, access decoded payload via:
// req.user = { userId: 1, email: 'user@example.com' }
```

---

## 4. Database Query Patterns

```js
const pool = require('../db/pool');

// SELECT
const { rows } = await pool.query(
  'SELECT id, full_name, email FROM users WHERE id = $1',
  [userId]
);

// INSERT returning the new row
const result = await pool.query(
  'INSERT INTO things (name, user_id) VALUES ($1, $2) RETURNING *',
  [name, userId]
);
const newRow = result.rows[0];

// UPDATE
await pool.query(
  'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1',
  [token]
);

// DELETE
await pool.query('DELETE FROM things WHERE id = $1', [id]);
```

> ⚠️ **Always use parameterised queries** (`$1`, `$2`). Never use string template literals with user data.

---

## 5. DB Connectivity Guard (use in every catch block)

```js
function isDbConnected(req) {
  return Boolean(req.app?.locals?.dbConnected);
}

// Usage inside catch:
if (!isDbConnected(req)) {
  return res.status(503).json({ message: 'Database not available. Please try again later.' });
}
```

---

## 6. Standard Response Shapes

```js
// 200 OK — query
res.json(data);
res.json({ items: [...] });

// 201 Created — mutation
res.status(201).json({ message: 'Created successfully', data: row });

// 400 Bad Request — validation
res.status(400).json({ message: 'fieldName is required' });

// 401 Unauthorised
res.status(401).json({ message: 'Invalid credentials' });

// 404 Not Found
res.status(404).json({ message: 'Resource not found' });

// 409 Conflict
res.status(409).json({ message: 'Email already exists' });

// 500 Internal Server Error
res.status(500).json({ message: 'Operation failed' });

// 503 DB Unavailable
res.status(503).json({ message: 'Database not available. Please try again later.' });
```

---

## 7. Token Utilities (`utils/tokenUtils.js`)

```js
const {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiryDate,
} = require('../utils/tokenUtils');

const payload = { userId: user.id, email: user.email };

const accessToken  = createAccessToken(payload);   // signs with ACCESS_TOKEN_SECRET, expires in ACCESS_TOKEN_EXPIRES_IN (default 1d)
const refreshToken = createRefreshToken(payload);  // signs with REFRESH_TOKEN_SECRET, expires in REFRESH_TOKEN_EXPIRES_IN (default 7d)
const expiresAt    = getRefreshTokenExpiryDate();  // Date object for DB storage
```

---

## 8. Serving Static JSON Files

```js
// Option A — sendFile (fastest, no parsing)
const filePath = path.resolve(__dirname, '..', 'data', 'models.json');
res.sendFile(filePath);

// Option B — readJson helper (when you need to transform/filter)
function readJson(relativePath) {
  const filePath = path.resolve(dataDirectory, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
const data = readJson('agents.json');
res.json({ agents: data.agents || [] });
```

---

## 9. Adding a New Table

```sql
-- Add to db/init.sql and run manually or via psql:
CREATE TABLE IF NOT EXISTS agents (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  emoji       TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. Environment Variables Reference

```env
# Required in backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=nexusai
ACCESS_TOKEN_SECRET=<random 64-char string>
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=<different random string>
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
```

---

## 11. Full Auth Flow Reference

| Endpoint | Method | Body | Auth | Response |
|---|---|---|---|---|
| `/api/auth/create-account` | POST | `{ fullName, email, password }` | None | `201 { message, user }` |
| `/api/auth/signin` | POST | `{ email, password }` | None | `200 { message, accessToken, refreshToken, user }` |
| `/api/auth/refresh-token` | POST | `{ refreshToken }` | None | `200 { message, accessToken, refreshToken }` |
| `/api/auth/logout` | POST | `{ refreshToken }` | None | `200 { message }` |
| `/api/auth/me` | GET | — | Bearer `accessToken` | `200 { user }` |

---

## 12. Checklist Before Finishing

- [ ] Raw SQL uses `$1, $2…` (no string interpolation)
- [ ] Every async function has a `try/catch` with `isDbConnected` guard
- [ ] New route registered in `routes/index.js`
- [ ] `npm run dev` starts without errors
- [ ] No `console.log` left in `verifyJwt.js` (auth header logs should be removed in production)
