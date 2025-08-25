const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const { logActivity, initSocketIO } = require("../utils/logActivity");

// it only admin can create
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      role,
      name,
      address,
      licenseNumber,
      emergencyContact,
    } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!email || !phone || !password || !role || !name) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    if (role === "driver" && (!licenseNumber || !emergencyContact)) {
      return res
        .status(400)
        .json({ message: "Please provide all driver profile fields." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      username: email,
      email,
      phone,
      password: hashPassword,
      role,
      profile: {
        name,
        address,
        licenseNumber,
        emergencyContact,
      },
    });
    console.log(newUser);
    await newUser.save();
    try {
      await logActivity({
        type: "user_created",
        message: `Created ${newUser.role} ${newUser.username}`,
        userId: newUser._id,
      });
    } catch (logErr) {
      console.error("Failed to log activity", logErr);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        ...newUser.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, name, role = "user" } = req.body;
    console.log(req.body);

    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      profile: { name },
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate required fields
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or username and password are required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: error.message,
    });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token." });
    }
    const resetLink = `${process.env.ServerURL}/reset-password?token=${token}`;
    await sendMail(
      email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`
    );
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
      resetLink,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token." });
    }
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successful." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin" && userRole !== "manager") {
      return res.status(403).json({ message: "Access denied." });
    }

    let users = await User.find({ _id: { $ne: req.user.id } }).sort({
      createdAt: -1,
    });

    if (userRole === "manager") {
      users = users.filter((u) => u.role == "driver");
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message || error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, phone, role, status, profile = {} } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;

    // Update profile fields
    if (!user.profile) user.profile = {}; // ensure profile exists
    if (profile.name) user.profile.name = profile.name;
    if (profile.address) user.profile.address = profile.address;
    if (profile.licenseNumber)
      user.profile.licenseNumber = profile.licenseNumber;
    if (profile.emergencyContact)
      user.profile.emergencyContact = profile.emergencyContact;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Edit User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  editUser,
  getCurrentUser,
};
