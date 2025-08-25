const {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,

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
  roleMiddleware("admin", "manager", "driver", "user"),
  getAllVehicles
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver", "user"),
  VehicleByID
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateVehicle
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteVehicle);

module.exports = router;
