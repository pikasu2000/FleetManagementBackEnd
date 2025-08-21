const {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicle.controller");
const express = require("express");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createVehicle
);

router.get("/", getAllVehicles);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateVehicle
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteVehicle
);

module.exports = router;
