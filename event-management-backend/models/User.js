// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  avatar: { type: String },
  company: { type: String },
  position: { type: String },
  bio: { type: String },
  website: { type: String },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  preferences: {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    language: { type: String, default: "en" }
  }
}, { timestamps: true });

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.model("User", userSchema);
