const {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  AssignDriver,
  VehicleByID,
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

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver"),
  getAllVehicles
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver"),
  VehicleByID
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateVehicle
);

router.put(
  "/assign-driver/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  AssignDriver
);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteVehicle);

module.exports = router;
