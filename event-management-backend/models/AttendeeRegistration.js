// models/AttendeeRegistration.js
import mongoose from "mongoose";

const attendeeRegistrationSchema = new mongoose.Schema({
  attendee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true }
}, { timestamps: true });

export default mongoose.model("AttendeeRegistration", attendeeRegistrationSchema);
