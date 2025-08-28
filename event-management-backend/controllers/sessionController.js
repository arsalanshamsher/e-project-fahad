import Session from "../models/Session.js";
import Expo from "../models/Expo.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// Get all sessions for an expo
export const getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category, date } = req.query;
    
    let query = { expo: req.params.expoId };
    if (type) query.type = type;
    if (category) query.category = category;
    if (date) {
      const searchDate = new Date(date);
      query.startTime = {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const sessions = await Session.find(query)
      .populate("speakers.user", "name company position avatar")
      .populate("moderator", "name company position avatar")
      .sort({ startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("expo", "title startDate endDate location")
      .populate("speakers.user", "name company position avatar bio")
      .populate("moderator", "name company position avatar")
      .populate("registeredAttendees", "name company position avatar");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new session
export const createSession = async (req, res) => {
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
      return res.status(403).json({ message: "Not authorized to create sessions for this expo" });
    }

    // Calculate duration if not provided
    if (!req.body.duration && req.body.startTime && req.body.endTime) {
      const start = new Date(req.body.startTime);
      const end = new Date(req.body.endTime);
      req.body.duration = Math.round((end - start) / (1000 * 60)); // in minutes
    }

    const session = new Session(req.body);
    await session.save();

    // Add session to expo schedule
    await Expo.findByIdAndUpdate(req.body.expo, {
      $push: { "schedule.sessions": session._id }
    });

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update session
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const expo = await Expo.findById(session.expo);
    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Calculate duration if start/end times changed
    if (req.body.startTime && req.body.endTime) {
      const start = new Date(req.body.startTime);
      const end = new Date(req.body.endTime);
      req.body.duration = Math.round((end - start) / (1000 * 60));
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: "Session updated successfully", session: updatedSession });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const expo = await Expo.findById(session.expo);
    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Remove session from expo schedule
    await Expo.findByIdAndUpdate(session.expo, {
      $pull: { "schedule.sessions": session._id }
    });

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register for session
export const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.settings.allowRegistration) {
      return res.status(400).json({ message: "Registration is not allowed for this session" });
    }

    // Check if user is already registered
    if (session.registeredAttendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered for this session" });
    }

    // Check capacity
    if (session.maxAttendees && session.registeredAttendees.length >= session.maxAttendees) {
      // Add to waitlist if allowed
      if (session.settings.allowWaitlist) {
        if (!session.waitlist.includes(req.user.id)) {
          session.waitlist.push(req.user.id);
          await session.save();
          return res.json({ message: "Added to waitlist", status: "waitlist" });
        } else {
          return res.status(400).json({ message: "Already on waitlist" });
        }
      } else {
        return res.status(400).json({ message: "Session is at full capacity" });
      }
    }

    // Register for session
    session.registeredAttendees.push(req.user.id);
    
    // Remove from waitlist if they were there
    session.waitlist = session.waitlist.filter(id => id.toString() !== req.user.id);
    
    await session.save();

    res.json({ message: "Successfully registered for session", status: "registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel session registration
export const cancelSessionRegistration = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Remove from registered attendees
    session.registeredAttendees = session.registeredAttendees.filter(
      id => id.toString() !== req.user.id
    );

    // Remove from waitlist
    session.waitlist = session.waitlist.filter(
      id => id.toString() !== req.user.id
    );

    await session.save();

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get sessions by expo
export const getSessionsByExpo = async (req, res) => {
  try {
    const { type, category, date } = req.query;
    
    let query = { expo: req.params.expoId };
    if (type) query.type = type;
    if (category) query.category = category;
    if (date) {
      const searchDate = new Date(date);
      query.startTime = {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const sessions = await Session.find(query)
      .populate("speakers.user", "name company position avatar")
      .populate("moderator", "name company position avatar")
      .sort({ startTime: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get sessions by speaker
export const getSessionsBySpeaker = async (req, res) => {
  try {
    const sessions = await Session.find({
      "speakers.user": req.params.speakerId
    })
    .populate("expo", "title startDate endDate location")
    .sort({ startTime: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get session analytics
export const getSessionAnalytics = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.expoId);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (expo.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const sessionStats = await Session.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: "$registeredAttendees" } },
          avgRating: { $avg: "$analytics.averageRating" },
          totalFeedback: { $sum: "$analytics.feedbackCount" }
        }
      }
    ]);

    const categoryStats = await Session.aggregate([
      { $match: { expo: expo._id } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: "$registeredAttendees" } }
        }
      }
    ]);

    const totalSessions = await Session.countDocuments({ expo: expo._id });
    const totalAttendees = await Session.aggregate([
      { $match: { expo: expo._id } },
      { $group: { _id: null, total: { $sum: { $size: "$registeredAttendees" } } } }
    ]);

    res.json({
      totalSessions,
      totalAttendees: totalAttendees[0]?.total || 0,
      typeBreakdown: sessionStats,
      categoryBreakdown: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add session feedback
export const addSessionFeedback = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.settings.allowFeedback) {
      return res.status(400).json({ message: "Feedback is not allowed for this session" });
    }

    // Check if user attended the session
    if (!session.registeredAttendees.includes(req.user.id)) {
      return res.status(400).json({ message: "You must be registered for this session to provide feedback" });
    }

    // Check if user already provided feedback
    const existingFeedback = session.feedback.find(
      f => f.attendee.toString() === req.user.id
    );

    if (existingFeedback) {
      return res.status(400).json({ message: "You have already provided feedback for this session" });
    }

    const { rating, comment } = req.body;

    session.feedback.push({
      attendee: req.user.id,
      rating,
      comment
    });

    // Update analytics
    const totalRating = session.feedback.reduce((sum, f) => sum + f.rating, 0);
    session.analytics.averageRating = totalRating / session.feedback.length;
    session.analytics.feedbackCount = session.feedback.length;

    await session.save();

    res.json({ message: "Feedback submitted successfully", session });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
