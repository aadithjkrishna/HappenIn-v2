import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  name: { type: String, required: true },
  faculty: { type: String, required: true },
  event: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  contact: { type: String, required: true },
  remarks: { type: String },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
