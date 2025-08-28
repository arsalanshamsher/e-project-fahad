// models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, enum: ["admin", "organizer", "exhibitor", "attendee"], required: true }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
