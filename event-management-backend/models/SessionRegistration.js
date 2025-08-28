// models/SessionRegistration.js
import mongoose from "mongoose";

const sessionRegistrationSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  attendee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("SessionRegistration", sessionRegistrationSchema);
