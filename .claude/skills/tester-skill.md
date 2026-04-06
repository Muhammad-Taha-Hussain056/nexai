---
name: tester-skill
description: Deep reference skill for writing, running, and debugging tests across the NexusAI monorepo — Express.js controller unit tests with pool mocking, Supertest integration tests, and React Testing Library component tests. Load this skill before writing any test file.
---

# NexusAI Tester Skill

## 1. Backend — Unit Testing an Express Controller

The key technique is to **mock `pool.query`** so tests never touch the real database.

```js
// controller/__tests__/authController.test.js
const pool          = require('../../db/pool');
const bcrypt        = require('bcryptjs');
const { signIn }    = require('../authController');

jest.mock('../../db/pool',  () => ({ query: jest.fn() }));
jest.mock('bcryptjs',       () => ({ compare: jest.fn(), hash: jest.fn() }));
jest.mock('../../utils/tokenUtils', () => ({
  createAccessToken:       jest.fn(() => 'mock-access-token'),
  createRefreshToken:      jest.fn(() => 'mock-refresh-token'),
  getRefreshTokenExpiryDate: jest.fn(() => new Date()),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mockReq(body = {}, appLocals = { dbConnected: true }) {
  return { body, app: { locals: appLocals } };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('signIn', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 400 when email or password is missing', async () => {
    const res = mockRes();
    await signIn(mockReq({ email: 'a@b.com' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  it('returns 401 when user is not found', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    const res = mockRes();
    await signIn(mockReq({ email: 'x@x.com', password: 'Pass1!' }), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when password does not match', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, email: 'a@b.com', password_hash: 'hashed' }] });
    bcrypt.compare.mockResolvedValueOnce(false);
    const res = mockRes();
    await signIn(mockReq({ email: 'a@b.com', password: 'wrong' }), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 200 with tokens on success', async () => {
    pool.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, full_name: 'Ali', email: 'a@b.com', password_hash: 'hashed' }] })
      .mockResolvedValueOnce({});   // INSERT refresh token
    bcrypt.compare.mockResolvedValueOnce(true);
    const res = mockRes();
    await signIn(mockReq({ email: 'a@b.com', password: 'Pass1!' }), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      accessToken:  'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }));
  });
});
```

---

## 2. Backend — Unit Testing `dataController`

Mock `fs.readFileSync` so no actual JSON files are read from disk.

```js
// controller/__tests__/dataController.test.js
const fs = require('fs');
const { getResearchFeed, getResearchItem } = require('../dataController');

jest.mock('fs');

const feedFixture = {
  feedTitle: 'AI Research',
  updatedAt: '2026-04-01',
  items: [
    { id: 'item-1', title: 'Test Breakthrough', category: 'Reasoning', modelReferences: [] }
  ]
};

function mockReq(params = {}) {
  return { params };
}
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  res.sendFile = jest.fn();
  return res;
}

beforeEach(() => {
  fs.readFileSync.mockReturnValue(JSON.stringify(feedFixture));
});
afterEach(() => jest.clearAllMocks());

describe('getResearchFeed', () => {
  it('returns feedTitle and items', () => {
    const res = mockRes();
    getResearchFeed(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ items: expect.any(Array) }));
  });
});

describe('getResearchItem', () => {
  it('returns the item when found', () => {
    const res = mockRes();
    getResearchItem(mockReq({ id: 'item-1' }), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'item-1' }));
  });

  it('returns 404 when item not found', () => {
    const res = mockRes();
    getResearchItem(mockReq({ id: 'no-such-id' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
```

---

## 3. Backend — Testing `verifyJwt` Middleware

```js
// middleware/__tests__/verifyJwt.test.js
const jwt      = require('jsonwebtoken');
const verifyJwt = require('../verifyJwt');

jest.mock('jsonwebtoken');

function makeReq(authHeader) {
  return { headers: { authorization: authHeader }, app: { locals: {} } };
}

describe('verifyJwt middleware', () => {
  const next = jest.fn();
  afterEach(() => jest.clearAllMocks());

  it('calls next() and sets req.user when token is valid', () => {
    jwt.verify.mockReturnValue({ userId: 1, email: 'a@b.com' });
    const req = makeReq('Bearer valid-token');
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    verifyJwt(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: 1, email: 'a@b.com' });
  });

  it('returns 401 when Authorization header is missing', () => {
    const req = makeReq('');
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    verifyJwt(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });
    const req = makeReq('Bearer bad-token');
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    verifyJwt(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

---

## 4. Backend — Supertest Integration Test

> First: export `app` from `server.js` and guard `start()`:
> ```js
> // server.js (bottom)
> if (process.env.NODE_ENV !== 'test') start();
> module.exports = app;
> ```

```js
// __tests__/auth.e2e.test.js
const request = require('supertest');
const app     = require('../server');

describe('Auth endpoints (integration)', () => {
  const timestamp = Date.now();
  const email = `test${timestamp}@nexusai.com`;

  it('POST /api/auth/create-account → 201', async () => {
    const res = await request(app)
      .post('/api/auth/create-account')
      .send({ fullName: 'Test User', email, password: 'Pass1234!' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user.id');
  });

  it('POST /api/auth/signin → 200 with tokens', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email, password: 'Pass1234!' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('POST /api/auth/signin → 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email, password: 'WrongPass!' });
    expect(res.status).toBe(401);
  });
});
```

---

## 5. Frontend — Component Test

```tsx
// components/marketplace/ModelCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ModelCard from './ModelCard';

const mockModel = {
  id: '1', name: 'GPT-5.4', provider: 'OpenAI',
  description: 'Leading model.', pricing: { input: 2.5, output: 15 }
};

describe('ModelCard', () => {
  it('renders model name and provider', () => {
    render(<ModelCard model={mockModel} />);
    expect(screen.getByText('GPT-5.4')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<ModelCard model={mockModel} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockModel);
  });
});
```

---

## 6. Frontend — Page Test with Service Mock

```tsx
// app/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';
import * as svc from '@/services/modelService';

jest.mock('@/services/modelService');
jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname:     () => '/',
}));
jest.mock('@/store/useStore', () => ({ useStore: () => ({ user: null, logout: jest.fn() }) }));

describe('Home page', () => {
  it('renders featured models', async () => {
    (svc.fetchAllModels as jest.Mock).mockResolvedValue({
      models: [{ id: '1', name: 'GPT-5.4', provider: 'OpenAI' }]
    });
    render(<Home />);
    await waitFor(() => expect(screen.getByText('GPT-5.4')).toBeInTheDocument());
  });
});
```

---

## 7. Common Frontend Mock Patterns

```typescript
jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname:     () => '/',
}));

jest.mock('@/store/useStore', () => ({
  useStore: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock('@/lib/cookies', () => ({
  getAccessToken:   jest.fn(() => null),
  setAuthTokens:    jest.fn(),
  clearAuthTokens:  jest.fn(),
}));

jest.mock('@/services/modelService', () => ({
  fetchAllModels:       jest.fn(),
  fetchAgents:          jest.fn(),
  fetchResearchFeed:    jest.fn(),
  fetchModelReferences: jest.fn(),
}));
```

---

## 8. Running Tests

```bash
# Backend
cd backend
npm test                    # run all tests
npm run test:coverage       # with coverage report
npm run test:watch          # watch mode

# Frontend
cd frontend
npm run test
npm run test -- --coverage
npm run test -- --testPathPattern=ModelCard  # run single file
```
