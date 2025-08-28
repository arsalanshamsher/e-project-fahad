import Expo from "../models/Expo.js";
import User from "../models/User.js";
import Booth from "../models/Booth.js";
import Session from "../models/Session.js";
import { validationResult } from "express-validator";

// Create new expo
export const createExpo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expoData = {
      ...req.body,
      organizer: req.user.id
    };

    const expo = new Expo(expoData);
    await expo.save();

    res.status(201).json({ message: "Expo created successfully", expo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all expos
export const getAllExpos = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    let query = { status: { $ne: "draft" } };
    if (status) query.status = status;
    if (category) query.categories = category;

    const expos = await Expo.find(query)
      .populate("organizer", "name company")
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expo.countDocuments(query);

    res.json({
      expos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expo by ID
export const getExpoById = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)
      .populate("organizer", "name company position avatar")
      .populate("schedule.sessions", "title startTime endTime location");

    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    res.json(expo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update expo
export const updateExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedExpo = await Expo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: "Expo updated successfully", expo: updatedExpo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete expo
export const deleteExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Expo.findByIdAndDelete(req.params.id);
    res.json({ message: "Expo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Publish expo
export const publishExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    expo.status = "published";
    await expo.save();

    res.json({ message: "Expo published successfully", expo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unpublish expo
export const unpublishExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    expo.status = "draft";
    await expo.save();

    res.json({ message: "Expo unpublished successfully", expo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search expos
export const searchExpos = async (req, res) => {
  try {
    const { q, category, location, startDate, endDate } = req.query;
    
    let query = { status: { $ne: "draft" } };
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { theme: { $regex: q, $options: "i" } }
      ];
    }
    
    if (category) query.categories = category;
    if (location) query["location.city"] = { $regex: location, $options: "i" };
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };

    const expos = await Expo.find(query)
      .populate("organizer", "name company")
      .sort({ startDate: 1 });

    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expos by category
export const getExposByCategory = async (req, res) => {
  try {
    const expos = await Expo.find({
      categories: req.params.category,
      status: { $ne: "draft" }
    })
    .populate("organizer", "name company")
    .sort({ startDate: 1 });

    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expos by location
export const getExposByLocation = async (req, res) => {
  try {
    const expos = await Expo.find({
      "location.city": { $regex: req.params.city, $options: "i" },
      status: { $ne: "draft" }
    })
    .populate("organizer", "name company")
    .sort({ startDate: 1 });

    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get upcoming expos
export const getUpcomingExpos = async (req, res) => {
  try {
    const expos = await Expo.find({
      startDate: { $gte: new Date() },
      status: { $ne: "draft" }
    })
    .populate("organizer", "name company")
    .sort({ startDate: 1 })
    .limit(10);

    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expos by organizer
export const getExposByOrganizer = async (req, res) => {
  try {
    const expos = await Expo.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register for expo
export const registerForExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.status !== "published") {
      return res.status(400).json({ message: "Expo is not open for registration" });
    }

    // Check if user is already registered
    const existingRegistration = await User.findOne({
      _id: req.user.id,
      "expoRegistrations.expo": req.params.id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this expo" });
    }

    // Add registration to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        expoRegistrations: {
          expo: req.params.id,
          registeredAt: new Date(),
          status: "confirmed"
        }
      }
    });

    // Update expo statistics
    await Expo.findByIdAndUpdate(req.params.id, {
      $inc: { "statistics.registeredAttendees": 1 }
    });

    res.json({ message: "Successfully registered for expo" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel expo registration
export const cancelExpoRegistration = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    // Remove registration from user
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { expoRegistrations: { expo: req.params.id } }
    });

    // Update expo statistics
    await Expo.findByIdAndUpdate(req.params.id, {
      $inc: { "statistics.registeredAttendees": -1 }
    });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expo analytics
export const getExpoAnalytics = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get booth analytics
    const boothStats = await Booth.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    // Get session analytics
    const sessionStats = await Session.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgRating: { $avg: "$analytics.averageRating" }
        }
      }
    ]);

    res.json({
      expo: expo.statistics,
      booths: boothStats,
      sessions: sessionStats
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expo statistics
export const getExpoStatistics = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(expo.statistics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expo attendees
export const getExpoAttendees = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const attendees = await User.find({
      "expoRegistrations.expo": req.params.id
    }).select("name email company position avatar");

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get expo exhibitors
export const getExpoExhibitors = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const exhibitors = await Booth.find({ expo: req.params.id })
      .populate("exhibitor", "name company position avatar")
      .select("boothNumber category price exhibitor");

    res.json(exhibitors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload expo image
export const uploadExpoImage = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // This would typically handle file upload
    // For now, we'll just add the image URL to the expo
    const { imageUrl, caption, isPrimary } = req.body;

    if (isPrimary) {
      // Remove primary flag from other images
      expo.images.forEach(img => img.isPrimary = false);
    }

    expo.images.push({ url: imageUrl, caption, isPrimary });
    await expo.save();

    res.json({ message: "Image uploaded successfully", expo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete expo image
export const deleteExpoImage = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    expo.images = expo.images.filter(img => img._id.toString() !== req.params.imageId);
    await expo.save();

    res.json({ message: "Image deleted successfully", expo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
