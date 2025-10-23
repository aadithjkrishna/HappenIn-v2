import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-event", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newEvent = new Event({ user: user._id, ...req.body });
    await newEvent.save();

    res.status(201).json({ message: "Event registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering event" });
  }
});

router.get("/booked-dates", verifyToken, async (req, res) => {
  try {
    const events = await Event.find();
    const result = {};

    events.forEach(event => {
      const [year, month, day] = event.eventDate.split("-").map(Number);
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (!result[key]) result[key] = {};
      if (!result[key][day]) result[key][day] = [];
      result[key][day].push({ event: event.eventName, halls: event.venue });
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load events" });
  }
});

export default router;
