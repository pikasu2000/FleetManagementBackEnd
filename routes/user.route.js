const {
  loginUser,
  createUser,
  registerUser,
  resetPassword,
  forgotPassword,
  getUsers,
  deleteUser,
  editUser,
  
  getCurrentUser,
} = require("../controllers/user.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");
const express = require("express");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createUser
);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUser", authMiddleware, getUsers);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/edit/:id", authMiddleware, roleMiddleware("admin"), editUser);
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
