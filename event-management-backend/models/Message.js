// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["direct", "announcement", "notification", "support"], 
    default: "direct" 
  },
  priority: { 
    type: String, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  status: { 
    type: String, 
    enum: ["sent", "delivered", "read", "archived"], 
    default: "sent" 
  },
  attachments: [{
    name: String,
    type: String,
    url: String,
    size: Number
  }],
  metadata: {
    isRead: { type: Boolean, default: false },
    readAt: Date,
    isArchived: { type: Boolean, default: false },
    archivedAt: Date,
    isStarred: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
  },
  tags: [String],
  expiresAt: Date,
  readReceipt: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for better query performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ expo: 1, createdAt: -1 });
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ type: 1, priority: 1 });

export default mongoose.model("Message", messageSchema);
