const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
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

    // Validate required fields
    if (!username || !email || !phone || !password || !role || !name) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    if (
      role === "driver" &&
      (!profile.licenseNumber || !profile.emergencyContact)
    ) {
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

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        ...newUser,
        password: undefined, // Exclude password from response
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password." });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Login successful.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Login Failed", error });
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

module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
