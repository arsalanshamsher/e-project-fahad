// models/Expo.js
import mongoose from "mongoose";

const expoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  theme: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    venue: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["draft", "published", "active", "completed", "cancelled"], 
    default: "draft" 
  },
  capacity: {
    maxAttendees: { type: Number },
    maxExhibitors: { type: Number },
    maxBooths: { type: Number }
  },
  pricing: {
    attendeePrice: { type: Number, default: 0 },
    exhibitorPrice: { type: Number, default: 0 },
    earlyBirdDiscount: { type: Number, default: 0 },
    earlyBirdEndDate: { type: Date }
  },
  categories: [{ type: String }],
  tags: [{ type: String }],
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  floorPlan: {
    imageUrl: String,
    description: String
  },
  schedule: {
    setupDay: Date,
    teardownDay: Date,
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }]
  },
  statistics: {
    registeredAttendees: { type: Number, default: 0 },
    registeredExhibitors: { type: Number, default: 0 },
    boothOccupancy: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  settings: {
    allowPublicRegistration: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxBoothsPerExhibitor: { type: Number, default: 1 },
    allowBoothSharing: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Indexes for better query performance
expoSchema.index({ startDate: 1, endDate: 1 });
expoSchema.index({ status: 1 });
expoSchema.index({ organizer: 1 });
expoSchema.index({ location: { city: 1, country: 1 } });
expoSchema.index({ categories: 1 });

export default mongoose.model("Expo", expoSchema);
