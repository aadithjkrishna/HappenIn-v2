import express from "express";
import multer from "multer";
import path from "path";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/lost", upload.single("itemPicture"), async (req, res) => {
  try {
    const { itemName, description, eventName } = req.body;
    const pictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const lostItem = new LostItem({
      itemName,
      description,
      eventName,
      pictureUrl,
      reportedBy: req.user ? req.user.id : null,
    });

    await lostItem.save();
    res.status(201).json({ message: "Lost item reported successfully", lostItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/found", async (req, res) => {
  try {
    const { itemName, eventName, contactNumber } = req.body;
    const foundItem = new FoundItem({
      itemName,
      eventName,
      contactNumber,
      reportedBy: req.user ? req.user.id : null,
    });

    await foundItem.save();
    res.status(201).json({ message: "Found item reported successfully", foundItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
