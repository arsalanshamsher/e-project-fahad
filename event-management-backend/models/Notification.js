// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
  type: { 
    type: String, 
    enum: [
      "expo_update", "booth_booking", "session_registration", "message_received",
      "reminder", "announcement", "system", "payment", "approval", "schedule_change"
    ], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  status: { 
    type: String, 
    enum: ["unread", "read", "archived"], 
    default: "unread" 
  },
  action: {
    type: { type: String, enum: ["link", "button", "none"] },
    text: String,
    url: String,
    data: mongoose.Schema.Types.Mixed
  },
  metadata: {
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isArchived: { type: Boolean, default: false },
    archivedAt: Date,
    isDismissed: { type: Boolean, default: false },
    dismissedAt: Date
  },
  expiresAt: Date,
  scheduledFor: Date,
  deliveryChannels: [{
    type: { type: String, enum: ["in_app", "email", "sms", "push"] },
    sent: { type: Boolean, default: false },
    sentAt: Date,
    failed: { type: Boolean, default: false },
    errorMessage: String
  }],
  category: String,
  tags: [String],
  relatedEntities: {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
    booth: { type: mongoose.Schema.Types.ObjectId, ref: "Booth" },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
}, { timestamps: true });

// Indexes for better query performance
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ expo: 1, type: 1, createdAt: -1 });
notificationSchema.index({ status: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });

export default mongoose.model("Notification", notificationSchema);
