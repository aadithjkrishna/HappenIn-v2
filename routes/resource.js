import express from 'express';
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from "../models/Booking.js";

const router = express.Router();

router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/resources/:id', async (req, res) => {
    const { id } = req.params;
    const { booked } = req.body;
    try {
        const updated = await Resource.findByIdAndUpdate(id, { booked }, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating resource" });
    }
});

router.post("/bookings", async (req, res) => {
  try {
    const {
      resourceId,
      name,
      faculty,
      event,
      dateFrom,
      dateTo,
      contact,
      remarks,
      quantity,
    } = req.body;

    if (
      !resourceId ||
      !name ||
      !faculty ||
      !event ||
      !dateFrom ||
      !dateTo ||
      !contact ||
      !quantity
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    // Check availability
    if (quantity > resource.quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    // Create booking entry
    const booking = new Booking({
      resourceId,
      name,
      faculty,
      event,
      dateFrom,
      dateTo,
      contact,
      remarks,
      quantity,
    });
    await booking.save();

    // Decrease resource quantity
    resource.quantity -= quantity;
    await resource.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;