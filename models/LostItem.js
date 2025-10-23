import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  eventName: { type: String, required: true },
  pictureUrl: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("LostItem", lostItemSchema);