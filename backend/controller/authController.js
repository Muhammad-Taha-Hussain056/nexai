const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiryDate,
} = require("../utils/tokenUtils");

function isDbConnected(req) {
  return Boolean(req.app?.locals?.dbConnected);
}

async function createAccount(req, res) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "fullName, email, and password are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at",
      [fullName, normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: userResult.rows[0],
    });
  } catch (error) {
    if (!isDbConnected(req)) {
      return res
        .status(503)
        .json({ message: "Database not available. Please try again later." });
    }
    console.error("[auth] createAccount error:", error.message);
    return res.status(500).json({ message: "Failed to create account" });
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const userResult = await pool.query(
      "SELECT id, full_name, email, password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    const refreshTokenExpiresAt = getRefreshTokenExpiryDate();

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, refreshTokenExpiresAt]
    );

    return res.json({
      message: "Signin successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    if (!isDbConnected(req)) {
      return res
        .status(503)
        .json({ message: "Database not available. Please try again later." });
    }
    console.error("[auth] signIn error:", error.message);
    return res.status(500).json({ message: "Signin failed" });
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenResult = await pool.query(
      "SELECT id, user_id, is_revoked, expires_at FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );

    if (tokenResult.rowCount === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const storedToken = tokenResult.rows[0];

    if (storedToken.is_revoked || new Date(storedToken.expires_at) < new Date()) {
      return res.status(401).json({ message: "Refresh token expired or revoked" });
    }

    const newPayload = { userId: decoded.userId, email: decoded.email };
    const newAccessToken = createAccessToken(newPayload);
    const newRefreshToken = createRefreshToken(newPayload);
    const newRefreshExpiresAt = getRefreshTokenExpiryDate();

    await pool.query("UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = $1", [
      storedToken.id,
    ]);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [storedToken.user_id, newRefreshToken, newRefreshExpiresAt]
    );

    return res.json({
      message: "Token refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (!isDbConnected(req)) {
      return res
        .status(503)
        .json({ message: "Database not available. Please try again later." });
    }
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

async function logout(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    await pool.query("UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1", [
      refreshToken,
    ]);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    if (!isDbConnected(req)) {
      return res
        .status(503)
        .json({ message: "Database not available. Please try again later." });
    }
    console.error("[auth] logout error:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
}

async function me(req, res) {
  try {
    const userResult = await pool.query(
      "SELECT id, full_name, email, created_at FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: userResult.rows[0] });
  } catch (error) {
    if (!isDbConnected(req)) {
      return res
        .status(503)
        .json({ message: "Database not available. Please try again later." });
    }
    console.error("[auth] me error:", error.message);
    return res.status(500).json({ message: "Failed to load user profile" });
  }
}

module.exports = {
  createAccount,
  signIn,
  refreshToken,
  logout,
  me,
};
