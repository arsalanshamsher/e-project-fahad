// models/Exhibitor.js
import mongoose from "mongoose";

const exhibitorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  description: String,
  logo: String,
  contactInfo: {
    email: String,
    phone: String,
    website: String
  }
}, { timestamps: true });

export default mongoose.model("Exhibitor", exhibitorSchema);
