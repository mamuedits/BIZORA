import express from "express";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


// DELETE a message (only sender)
router.delete("/:messageId", authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (String(message.from) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

/* =========================
   RECENT CHATS (MUST BE FIRST)
   GET /messages/recent
========================= */
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user._id },
        { to: req.user._id }
      ]
    })
      .sort({ updatedAt: -1 })
      .populate("from to", "name userId avatar role");

    const usersMap = new Map();

    messages.forEach(m => {
      const other =
        String(m.from._id) === String(req.user._id)
          ? m.to
          : m.from;

      usersMap.set(other._id.toString(), other);
    });

    res.json([...usersMap.values()]);
  } catch (err) {
    res.status(500).json({ message: "Failed to load recent chats" });
  }
});

/* =========================
   GET CONVERSATION
   GET /messages/:userId
========================= */
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: req.params.userId },
        { from: req.params.userId, to: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

/* =========================
   SEND MESSAGE
   POST /messages/:userId
========================= */
router.post("/:userId", authMiddleware, async (req, res) => {
  try {
    const msg = await Message.create({
      from: req.user._id,
      to: req.params.userId,
      content: req.body.content
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.get("/unread/check", authMiddleware, async (req, res) => {
  const count = await Message.countDocuments({
    to: req.user._id,
    read: false
  });

  res.json({ hasUnread: count > 0 });
});

// Mark messages as read
router.put("/read/:userId", authMiddleware, async (req, res) => {
  await Message.updateMany(
    {
      from: req.params.userId,
      to: req.user._id,
      read: false
    },
    { $set: { read: true } }
  );

  res.json({ success: true });
});


export default router;
