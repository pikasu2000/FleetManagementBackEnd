const User = require("../models/User.model");

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
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
