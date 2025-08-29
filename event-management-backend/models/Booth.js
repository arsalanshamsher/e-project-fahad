// models/Booth.js
import mongoose from "mongoose";

const boothSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["standard", "premium", "vip", "corner", "island"], 
    required: true 
  },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  boothNumber: { type: String, required: true },
  size: { type: String, required: true }, // e.g., "10x10 ft"
  price: { type: Number, required: true },
  maxCapacity: { type: Number, required: true },
  location: { type: String, required: true }, // e.g., "A1", "B2", "Main Hall"
  status: { 
    type: String, 
    enum: ["available", "reserved", "occupied", "maintenance"], 
    default: "available" 
  },
  amenities: [{ type: String }], // Array of amenity names
  exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Additional fields for enhanced functionality
  category: { type: String, default: "Standard" },
  features: [{
    name: String,
    description: String,
    included: { type: Boolean, default: true }
  }],
  restrictions: [String],
  images: [{
    url: String,
    caption: String,
    type: { type: String, enum: ["floorplan", "booth", "setup"] }
  }],
  setup: {
    setupDate: Date,
    teardownDate: Date,
    specialRequirements: [String],
    powerRequirements: {
      voltage: Number,
      amperage: Number,
      outlets: Number
    },
    internetRequirements: {
      speed: String,
      wired: Boolean,
      wireless: Boolean
    }
  },
  bookings: [{
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"] },
    amount: Number,
    bookedAt: { type: Date, default: Date.now }
  }],
  analytics: {
    visitorCount: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    leadCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes for better query performance
boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });
boothSchema.index({ expo: 1, status: 1 });
boothSchema.index({ exhibitor: 1 });
boothSchema.index({ category: 1, price: 1 });
boothSchema.index({ createdBy: 1 });

export default mongoose.model("Booth", boothSchema);
