// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["keynote", "workshop", "panel", "presentation", "networking", "demo"], 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  location: {
    room: String,
    booth: { type: mongoose.Schema.Types.ObjectId, ref: "Booth" },
    capacity: Number,
    floor: String
  },
  speakers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    company: String,
    position: String,
    bio: String,
    avatar: String,
    isPrimary: { type: Boolean, default: false }
  }],
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { 
    type: String, 
    enum: ["scheduled", "in-progress", "completed", "cancelled", "postponed"], 
    default: "scheduled" 
  },
  category: { type: String, required: true },
  tags: [String],
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  materials: [{
    name: String,
    type: { type: String, enum: ["document", "video", "link", "download"] },
    url: String,
    description: String
  }],
  requirements: [String],
  maxAttendees: Number,
  registeredAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  recording: {
    allowed: { type: Boolean, default: false },
    url: String,
    availableUntil: Date
  },
  feedback: [{
    attendee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: { type: Date, default: Date.now }
  }],
  analytics: {
    attendance: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    feedbackCount: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 }
  },
  settings: {
    allowRegistration: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowWaitlist: { type: Boolean, default: true },
    allowFeedback: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Indexes for better query performance
sessionSchema.index({ expo: 1, startTime: 1 });
sessionSchema.index({ expo: 1, status: 1 });
sessionSchema.index({ speakers: 1 });
sessionSchema.index({ category: 1, type: 1 });

export default mongoose.model("Session", sessionSchema);
