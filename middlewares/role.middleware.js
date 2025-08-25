const User = require("../models/User.model");

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const users = await User.findById(req.user.id);
      if (!users) {
        return res.status(404).json({ message: "User not found." });
      }

      console.log("User Role:", users.role);
      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(users.role)) {
        // console.log("Allowed Roles:", allowedRoles);
        return res.status(403).json({ message: "Access denied." });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);
      return res.status(500).json({ message: "Server error.", error });
    }
  };
};

module.exports = roleMiddleware;
