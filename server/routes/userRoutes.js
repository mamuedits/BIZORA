import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Get my profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// Update my profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { startupName, bio, skills, links } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { startupName, bio, skills, links },
      { new: true }
    ).select("-passwordHash");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Update my avatar (no middleware)
router.put(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log(req.file);
      console.log(req.body);

      const avatarPath = `/uploads/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarPath },
        { new: true }
      ).select("-passwordHash");

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Avatar update failed" });
    }
  }
);

// routes/userRoutes.js
router.get("/by-userid/:userId", authMiddleware, async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId })
    .select("name userId avatar");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Public profile (read-only)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "userId name role avatar startupName bio skills links"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// Search users (kept from old code)
router.get("/", authMiddleware, async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: "i" } } : {};
  const users = await User.find(filter).select("name role startupName avatar email");
  res.json(users);
});

export default router;
