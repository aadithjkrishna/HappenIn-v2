import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  eventName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FoundItem", foundItemSchema);