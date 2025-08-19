const {
  loginUser,
  createUser,
  resetPassword,
  forgotPassword,
} = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
