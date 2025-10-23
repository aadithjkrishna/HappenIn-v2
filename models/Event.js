import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  participants: { type: Number, required: true },
  description: { type: String, required: true },
  eventType: { type: String, required: true },
  registrationLink: String,
  specialRequirements: String,
  powerBackup: String,
  powerBackupFee: String
});

export default mongoose.model("Event", eventSchema);