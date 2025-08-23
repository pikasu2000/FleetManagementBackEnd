const express = require("express");
const router = express.Router();
const {
  addMaintenance,
  getAllMaintenance,
  completeMaintenance,
} = require("../controllers/maintenance.controller");

const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  addMaintenance
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver"),
  getAllMaintenance
);
router.patch(
  "/complete/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  completeMaintenance
);

module.exports = router;
