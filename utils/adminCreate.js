const bcrypt = require("bcrypt");
const User = require("../models/User.model");

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashPassword = await bcrypt.hash("admin", 10);

    const newAdmin = new User({
      username: "admin",
      email: "admin@gmail.com",
      phone: "9999999999",
      password: hashPassword,
      role: "admin",
      profile: {
        name: "Admin User",
      },
    });

    await newAdmin.save();
    console.log("admin created successfully");
  } catch (err) {
    console.error("Failed to create admin:", err.message);
  }
};

module.exports = createDefaultAdmin;
