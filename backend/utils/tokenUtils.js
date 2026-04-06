const jwt = require("jsonwebtoken");

function expiresInToMs(value) {
  const match = String(value).trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error("Invalid expiresIn format. Use values like 15m, 1h, 1d.");
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
}

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
  });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
}

function getRefreshTokenExpiryDate() {
  const ttl = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  return new Date(Date.now() + expiresInToMs(ttl));
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiryDate,
};
