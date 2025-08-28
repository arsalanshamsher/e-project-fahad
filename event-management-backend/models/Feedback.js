// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
  booth: { type: mongoose.Schema.Types.ObjectId, ref: "Booth" },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  type: { 
    type: String, 
    enum: ["expo", "booth", "session", "general", "support", "suggestion"], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ["experience", "content", "organization", "facilities", "staff", "technical", "other"], 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  status: { 
    type: String, 
    enum: ["submitted", "under_review", "in_progress", "resolved", "closed"], 
    default: "submitted" 
  },
  priority: { 
    type: String, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  attachments: [{
    name: String,
    type: String,
    url: String,
    size: Number
  }],
  responses: [{
    responder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    isOfficial: { type: Boolean, default: false },
    respondedAt: { type: Date, default: Date.now }
  }],
  metadata: {
    isAnonymous: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolutionTime: Number, // in hours
    satisfactionScore: Number // follow-up rating after resolution
  },
  analytics: {
    helpfulCount: { type: Number, default: 0 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },
    responseTime: Number // in hours
  },
  flags: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: String,
    flaggedAt: { type: Date, default: Date.now }
  }],
  expiresAt: Date
}, { timestamps: true });

// Indexes for better query performance
feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ expo: 1, type: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, priority: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, rating: 1 });
feedbackSchema.index({ type: 1, status: 1 });

export default mongoose.model("Feedback", feedbackSchema);
