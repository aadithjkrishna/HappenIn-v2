import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Signup
router.post("/signup", async (req, res) => {
  const { fullname, email, address, phone, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      address,
      phone,
      username,
      password: hashedPassword
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // add role
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found!" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ message: "Error sending OTP." });
    res.status(200).json({ message: "OTP sent successfully!" });
  });
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] == otp) {
    delete otpStore[email];
    res.status(200).json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { password: hashedPassword });
  res.status(200).json({ message: "Password reset successfully!" });
});

router.post("/verify-token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.status(200).json({ message: "Token valid", user: decoded });
  });
});


export default router;
