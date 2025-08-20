const User = require("../models/User.model");

const roleMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = roleMiddleware;
