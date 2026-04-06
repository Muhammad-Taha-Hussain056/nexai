const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes");
const requestLogger = require("./middleware/requestLogger");
const pool = require("./db/pool");

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NexAi backend is running on port 3000" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

async function start() {
  let lastState = null;
  async function checkDb() {
    try {
      await pool.query("SELECT 1");
      app.locals.dbConnected = true;
      if (lastState !== true) console.log("[db] PostgreSQL attached");
      lastState = true;
    } catch (error) {
      app.locals.dbConnected = false;
      if (lastState !== false) {
        console.error("[db] PostgreSQL not attached:", error.message);
      }
      lastState = false;
    }
  }

  await checkDb();
  setInterval(checkDb, 5000).unref(); // keep checking but don't block process exit

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
