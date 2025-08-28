// models/Booth.js
import mongoose from "mongoose";

const boothSchema = new mongoose.Schema({
  expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
  boothNumber: { type: String, required: true },
  size: {
    width: { type: Number, required: true }, // in meters
    length: { type: Number, required: true }, // in meters
    area: { type: Number, required: true } // in square meters
  },
  location: {
    floor: { type: String, default: "Main Floor" },
    section: { type: String },
    coordinates: {
      x: Number,
      y: Number
    }
  },
  category: { type: String, required: true }, // Standard, Premium, VIP, etc.
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["available", "reserved", "occupied", "maintenance"], 
    default: "available" 
  },
  exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  features: [{
    name: String,
    description: String,
    included: { type: Boolean, default: true }
  }],
  amenities: [{
    name: String,
    description: String,
    quantity: Number
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

export default mongoose.model("Booth", boothSchema);
