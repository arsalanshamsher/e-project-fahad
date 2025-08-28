import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Expo from "../models/Expo.js";
import Booth from "../models/Booth.js";
import Session from "../models/Session.js";
import { validationResult } from "express-validator";

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { expo, booth, session, type, category, rating, title, content, tags, isAnonymous } = req.body;

    // Validate that at least one entity is provided
    if (!expo && !booth && !session) {
      return res.status(400).json({ message: "Must provide expo, booth, or session" });
    }

    // Check if expo exists (if provided)
    if (expo) {
      const expoExists = await Expo.findById(expo);
      if (!expoExists) {
        return res.status(404).json({ message: "Expo not found" });
      }
    }

    // Check if booth exists (if provided)
    if (booth) {
      const boothExists = await Booth.findById(booth);
      if (!boothExists) {
        return res.status(404).json({ message: "Booth not found" });
      }
    }

    // Check if session exists (if provided)
    if (session) {
      const sessionExists = await Session.findById(session);
      if (!sessionExists) {
        return res.status(404).json({ message: "Session not found" });
      }
    }

    const feedback = new Feedback({
      user: req.user.id,
      expo,
      booth,
      session,
      type,
      category,
      rating,
      title,
      content,
      tags,
      metadata: {
        isAnonymous: isAnonymous || false,
        isPublic: false
      }
    });

    await feedback.save();

    // Populate user details for response (if not anonymous)
    if (!isAnonymous) {
      await feedback.populate("user", "name company position avatar");
    }

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("user", "name company position avatar")
      .populate("expo", "title startDate endDate location")
      .populate("booth", "boothNumber category")
      .populate("session", "title startTime endTime");

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if user can view this feedback
    if (feedback.metadata.isAnonymous && feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view anonymous feedback" });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Only the author can update their feedback
    if (feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if feedback can still be updated
    if (feedback.status !== "submitted") {
      return res.status(400).json({ message: "Feedback cannot be updated in current status" });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: "Feedback updated successfully", feedback: updatedFeedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Only the author can delete their feedback
    if (feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback by expo (organizer/admin only)
export const getFeedbackByExpo = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category, status, rating } = req.query;
    
    let query = { expo: req.params.expoId };
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (rating) query.rating = Number(rating);

    const feedback = await Feedback.find(query)
      .populate("user", "name company position avatar")
      .populate("booth", "boothNumber category")
      .populate("session", "title startTime endTime")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback by user
export const getFeedbackByUser = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category, status } = req.query;
    
    let query = { user: req.user.id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    const feedback = await Feedback.find(query)
      .populate("expo", "title startDate endDate location")
      .populate("booth", "boothNumber category")
      .populate("session", "title startTime endTime")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Respond to feedback (organizer/admin only)
export const respondToFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const { content } = req.body;

    feedback.responses.push({
      responder: req.user.id,
      content,
      isOfficial: true,
      respondedAt: new Date()
    });

    // Update status to in_progress
    feedback.status = "in_progress";

    await feedback.save();

    // Populate responder details
    await feedback.populate("responses.responder", "name company position avatar");

    res.json({ message: "Response added successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark feedback as resolved (organizer/admin only)
export const markFeedbackResolved = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.status = "resolved";
    feedback.metadata.isResolved = true;
    feedback.metadata.resolvedAt = new Date();

    // Calculate resolution time
    const resolutionTime = (feedback.metadata.resolvedAt - feedback.createdAt) / (1000 * 60 * 60); // in hours
    feedback.metadata.resolutionTime = resolutionTime;

    await feedback.save();

    res.json({ message: "Feedback marked as resolved", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback analytics (organizer/admin only)
export const getFeedbackAnalytics = async (req, res) => {
  try {
    const { expo, startDate, endDate } = req.query;
    
    let query = {};
    if (expo) query.expo = expo;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Feedback.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
            status: "$status"
          },
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalRating: { $sum: "$rating" }
        }
      }
    ]);

    const ratingDistribution = await Feedback.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusBreakdown = await Feedback.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalFeedback = await Feedback.countDocuments(query);
    const avgRating = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);

    const resolvedCount = await Feedback.countDocuments({
      ...query,
      status: "resolved"
    });

    res.json({
      totalFeedback,
      avgRating: avgRating[0]?.avg || 0,
      resolvedCount,
      resolutionRate: totalFeedback > 0 ? resolvedCount / totalFeedback : 0,
      typeBreakdown: analytics,
      ratingDistribution,
      statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Flag feedback
export const flagFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const { reason } = req.body;

    // Check if user already flagged this feedback
    const existingFlag = feedback.flags.find(
      flag => flag.user.toString() === req.user.id
    );

    if (existingFlag) {
      return res.status(400).json({ message: "You have already flagged this feedback" });
    }

    feedback.flags.push({
      user: req.user.id,
      reason,
      flaggedAt: new Date()
    });

    await feedback.save();

    res.json({ message: "Feedback flagged successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback categories
export const getFeedbackCategories = async (req, res) => {
  try {
    const categories = await Feedback.distinct("category");
    const types = await Feedback.distinct("type");
    
    res.json({
      categories: categories.filter(Boolean),
      types: types.filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to create feedback notification
export const createFeedbackNotification = async (feedbackId, type, title, message) => {
  try {
    const feedback = await Feedback.findById(feedbackId).populate("expo");
    
    if (!feedback) return null;

    // Create notification for organizers/admins
    const organizers = await User.find({
      $or: [
        { role: "admin" },
        { role: "organizer" }
      ]
    });

    const notifications = organizers.map(organizer => ({
      recipient: organizer._id,
      expo: feedback.expo?._id,
      type: "feedback",
      title,
      message,
      priority: "normal",
      status: "unread",
      category: "feedback",
      relatedEntities: {
        feedback: feedbackId,
        expo: feedback.expo?._id,
        user: feedback.user
      },
      deliveryChannels: [
        { type: "in_app", sent: false },
        { type: "email", sent: false }
      ]
    }));

    // Import Notification model here to avoid circular dependency
    const Notification = (await import("../models/Notification.js")).default;
    await Notification.insertMany(notifications);

    return notifications.length;
  } catch (error) {
    console.error("Error creating feedback notification:", error);
    return 0;
  }
};
