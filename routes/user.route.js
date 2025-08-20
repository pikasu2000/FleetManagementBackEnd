const {
  loginUser,
  createUser,
  resetPassword,
  forgotPassword,
  getUsers,
  deleteUser,
  editUser,
} = require("../controllers/user.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");
const express = require("express");
const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("admin"), createUser);
router.post("/login", loginUser);
router.get("/getAllUser", authMiddleware, getUsers);
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
