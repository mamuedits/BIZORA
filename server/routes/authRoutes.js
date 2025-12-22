import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateUserId from "./generateuserID.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Register
router.post(
  "/register",
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { name, email, password, confirmPassword, role } = req.body;

      if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least one letter, one number and one special character",
        });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const userId = await generateUserId(role);

      const avatarPath = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const user = await User.create({
        userId,
        name,
        email,
        passwordHash,
        role,
        avatar: avatarPath,
      });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal Server Error",
      });
    }
  }
);



// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Incorrect Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role , avatar: user.avatar},
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

export default router;
