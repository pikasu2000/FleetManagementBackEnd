const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }
  // console.log("Incoming request:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);
    const user = await UserModel.findById(decoded.id);
    // console.log("Authenticated user:", user);
    if (!user) return res.status(401).json({ message: "Unauthorized User" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Not allowed" });
  }
};
module.exports = authMiddleware;
