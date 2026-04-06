const express = require("express");
const verifyJwt = require("../middleware/verifyJwt");
const {
  createAccount,
  signIn,
  refreshToken,
  logout,
  me,
} = require("../controller/authController");

const router = express.Router();

router.post("/create-account", createAccount);
router.post("/signin", signIn);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", verifyJwt, me);

module.exports = router;
