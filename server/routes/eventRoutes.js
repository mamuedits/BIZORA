import express from "express";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload2.js";
const router = express.Router();

// Create event

router.post(
  "/",
  authMiddleware,
  upload.single("banner"),
  async (req, res) => {
    try {
      const event = await Event.create({
        ...req.body,
        bannerUrl: req.file ? `/uploads/events/${req.file.filename}` : "",
        organizerId: req.user._id
      });

      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ message: "Error creating event", error: err.message });
    }
  }
);


// List upcoming events
router.get("/", authMiddleware, async (req, res) => {
  const events = await Event.find({ startTime: { $gte: new Date() } }).sort({ startTime: 1 });
  res.json(events);
});

import mongoose from "mongoose";

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // 🔐 OWNER CHECK
  if (event.organizerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Delete registrations
  await EventRegistration.deleteMany({ eventId: event._id });

  // Delete event
  await Event.findByIdAndDelete(id);

  res.json({ message: "Event deleted" });
});

router.put(
  "/:id",
  authMiddleware,
  upload.single("banner"), // 🔴 THIS WAS MISSING
  async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);

    if (req.file) {
      event.bannerUrl = `/uploads/events/${req.file.filename}`;
    }

    await event.save();
    res.json(event);
  }
);

// Event detail with attendee count
router.get("/:id", authMiddleware, async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizerId", "name startupName");
  if (!event) return res.status(404).json({ message: "Event not found" });

  const attendees = await EventRegistration.countDocuments({ eventId: event._id, status: "going" });
  res.json({ event, attendees });
});

// Register / RSVP
router.post("/:id/register", authMiddleware, async (req, res) => {
  const { status } = req.body; // "going" or "interested"
  try {
    const registration = await EventRegistration.findOneAndUpdate(
      { eventId: req.params.id, userId: req.user._id },
      { eventId: req.params.id, userId: req.user._id, status: status || "going" },
      { upsert: true, new: true }
    );
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: "Error registering", error: err.message });
  }
});

router.delete("/:id/register", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await EventRegistration.findOneAndDelete({
    eventId: id,
    userId: req.user._id
  });

  res.json({ message: "RSVP reset" });
});

export default router;
