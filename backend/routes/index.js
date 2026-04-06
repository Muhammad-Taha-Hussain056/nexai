const express = require("express");
const dataRoutes = require("./dataRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/", dataRoutes);
router.use("/auth", authRoutes);

module.exports = router;
