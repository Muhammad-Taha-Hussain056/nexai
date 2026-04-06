const { Pool } = require("pg");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Avoid IPv6/localhost resolution issues on some Windows setups
  family: 4,
};

console.log("[db] Connecting to", {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
});

const pool = new Pool(dbConfig);

// Make auth errors easier to spot (wrong password vs unreachable host).
pool.on("connect", () => {
  console.log("[pg] Pool connected");
});

// Helps you see DB connectivity problems in the backend console.
pool.on("error", (err) => {
  console.error("[pg] Pool error:", err.message);
});

module.exports = pool;
