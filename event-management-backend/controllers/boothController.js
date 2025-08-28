import Booth from "../models/Booth.js";
import Expo from "../models/Expo.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// Get all booths for an expo
export const getAllBooths = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, priceMin, priceMax } = req.query;
    
    let query = { expo: req.params.expoId };
    if (category) query.category = category;
    if (status) query.status = status;
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const booths = await Booth.find(query)
      .populate("exhibitor", "name company position avatar")
      .sort({ boothNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booth.countDocuments(query);

    res.json({
      booths,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get booth by ID
export const getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id)
      .populate("expo", "title startDate endDate location")
      .populate("exhibitor", "name company position avatar bio website socialMedia");

    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new booth
export const createBooth = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expo = await Expo.findById(req.body.expo);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to create booths for this expo" });
    }

    // Check if booth number already exists for this expo
    const existingBooth = await Booth.findOne({
      expo: req.body.expo,
      boothNumber: req.body.boothNumber
    });

    if (existingBooth) {
      return res.status(400).json({ message: "Booth number already exists for this expo" });
    }

    const booth = new Booth(req.body);
    await booth.save();

    res.status(201).json({ message: "Booth created successfully", booth });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update booth
export const updateBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    const expo = await Expo.findById(booth.expo);
    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedBooth = await Booth.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: "Booth updated successfully", booth: updatedBooth });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete booth
export const deleteBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    const expo = await Expo.findById(booth.expo);
    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booth.status !== "available") {
      return res.status(400).json({ message: "Cannot delete booth that is not available" });
    }

    await Booth.findByIdAndDelete(req.params.id);
    res.json({ message: "Booth deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Book booth
export const bookBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.status !== "available") {
      return res.status(400).json({ message: "Booth is not available for booking" });
    }

    const expo = await Expo.findById(booth.expo);
    if (expo.status !== "published") {
      return res.status(400).json({ message: "Expo is not open for booth booking" });
    }

    // Check if exhibitor already has a booth in this expo
    const existingBooth = await Booth.findOne({
      expo: booth.expo,
      exhibitor: req.user.id
    });

    if (existingBooth && !expo.settings.allowBoothSharing) {
      return res.status(400).json({ message: "You already have a booth in this expo" });
    }

    // Check if exhibitor has reached the maximum booths limit
    const boothCount = await Booth.countDocuments({
      expo: booth.expo,
      exhibitor: req.user.id
    });

    if (boothCount >= expo.settings.maxBoothsPerExhibitor) {
      return res.status(400).json({ message: "You have reached the maximum booth limit for this expo" });
    }

    booth.status = "reserved";
    booth.exhibitor = req.user.id;
    booth.bookings.push({
      exhibitor: req.user.id,
      startDate: new Date(),
      endDate: expo.endDate,
      status: "confirmed",
      paymentStatus: "pending",
      amount: booth.price,
      bookedAt: new Date()
    });

    await booth.save();

    // Update expo statistics
    await Expo.findByIdAndUpdate(booth.expo, {
      $inc: { "statistics.registeredExhibitors": 1 }
    });

    res.json({ message: "Booth booked successfully", booth });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel booth booking
export const cancelBoothBooking = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (booth.exhibitor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booth.status = "available";
    booth.exhibitor = null;
    booth.bookings = booth.bookings.filter(booking => 
      booking.exhibitor.toString() !== req.user.id
    );

    await booth.save();

    // Update expo statistics
    await Expo.findByIdAndUpdate(booth.expo, {
      $inc: { "statistics.registeredExhibitors": -1 }
    });

    res.json({ message: "Booth booking cancelled successfully", booth });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get booths by expo
export const getBoothsByExpo = async (req, res) => {
  try {
    const booths = await Booth.find({ expo: req.params.expoId })
      .populate("exhibitor", "name company position avatar")
      .sort({ boothNumber: 1 });

    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available booths
export const getAvailableBooths = async (req, res) => {
  try {
    const { category, priceMin, priceMax } = req.query;
    
    let query = { 
      expo: req.params.expoId,
      status: "available"
    };
    
    if (category) query.category = category;
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const booths = await Booth.find(query)
      .sort({ price: 1, boothNumber: 1 });

    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get booth analytics
export const getBoothAnalytics = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.expoId);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const boothStats = await Booth.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    const categoryStats = await Booth.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    const totalBooths = await Booth.countDocuments({ expo: expo._id });
    const totalRevenue = await Booth.aggregate([
      { $match: { expo: expo._id } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    res.json({
      totalBooths,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: boothStats,
      categoryBreakdown: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
