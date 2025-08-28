import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Expo from "../models/Expo.js";
import { validationResult } from "express-validator";

// Get notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, priority, expo } = req.query;
    
    let query = { recipient: req.user.id };
    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (expo) query.expo = expo;

    const notifications = await Notification.find(query)
      .populate("expo", "title")
      .populate("relatedEntities.user", "name company position avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("expo", "title startDate endDate location")
      .populate("relatedEntities.user", "name company position avatar")
      .populate("relatedEntities.booth", "boothNumber category")
      .populate("relatedEntities.session", "title startTime endTime");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Mark as read if not already read
    if (!notification.metadata.isRead) {
      notification.metadata.isRead = true;
      notification.metadata.readAt = new Date();
      await notification.save();
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.metadata.isRead = true;
    notification.metadata.readAt = new Date();
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, "metadata.isRead": false },
      { 
        "metadata.isRead": true, 
        "metadata.readAt": new Date() 
      }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as unread
export const markAsUnread = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.metadata.isRead = false;
    notification.metadata.readAt = null;
    await notification.save();

    res.json({ message: "Notification marked as unread", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Archive notification
export const archiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.metadata.isArchived = true;
    notification.metadata.archivedAt = new Date();
    await notification.save();

    res.json({ message: "Notification archived", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unarchive notification
export const unarchiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.metadata.isArchived = false;
    notification.metadata.archivedAt = null;
    await notification.save();

    res.json({ message: "Notification unarchived", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get notification settings
export const getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const { notifications, emailUpdates, language } = req.body;

    const updateData = {};
    if (notifications !== undefined) updateData["preferences.notifications"] = notifications;
    if (emailUpdates !== undefined) updateData["preferences.emailUpdates"] = emailUpdates;
    if (language !== undefined) updateData["preferences.language"] = language;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    );

    res.json({ message: "Settings updated successfully", preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send notification (organizer/admin only)
export const sendNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      recipients, 
      expo, 
      title, 
      message, 
      type, 
      priority, 
      category,
      action,
      scheduledFor 
    } = req.body;

    // Check if expo exists (if provided)
    if (expo) {
      const expoExists = await Expo.findById(expo);
      if (!expoExists) {
        return res.status(404).json({ message: "Expo not found" });
      }
    }

    // Determine recipients
    let recipientIds = [];
    if (recipients && recipients.length > 0) {
      recipientIds = recipients;
    } else if (expo) {
      // Send to all users registered for this expo
      const expoUsers = await User.find({
        "expoRegistrations.expo": expo
      });
      recipientIds = expoUsers.map(user => user._id);
    } else {
      // Send to all users
      const allUsers = await User.find({});
      recipientIds = allUsers.map(user => user._id);
    }

    // Create notifications
    const notifications = recipientIds.map(recipientId => ({
      recipient: recipientId,
      expo,
      title,
      message,
      type: type || "announcement",
      priority: priority || "normal",
      category,
      action,
      scheduledFor: scheduledFor || new Date(),
      deliveryChannels: [
        { type: "in_app", sent: false },
        { type: "email", sent: false }
      ]
    }));

    await Notification.insertMany(notifications);

    res.json({ 
      message: `Notification sent to ${recipientIds.length} users`,
      recipientsCount: recipientIds.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get notification analytics (organizer/admin only)
export const getNotificationAnalytics = async (req, res) => {
  try {
    const { expo, startDate, endDate } = req.query;
    
    let query = {};
    if (expo) query.expo = expo;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Notification.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            type: "$type",
            priority: "$priority",
            status: "$status"
          },
          count: { $sum: 1 },
          readCount: {
            $sum: { $cond: ["$metadata.isRead", 1, 0] }
          },
          archivedCount: {
            $sum: { $cond: ["$metadata.isArchived", 1, 0] }
          }
        }
      }
    ]);

    const deliveryStats = await Notification.aggregate([
      { $match: query },
      { $unwind: "$deliveryChannels" },
      {
        $group: {
          _id: "$deliveryChannels.type",
          total: { $sum: 1 },
          sent: { $sum: { $cond: ["$deliveryChannels.sent", 1, 0] } },
          failed: { $sum: { $cond: ["$deliveryChannels.failed", 1, 0] } }
        }
      }
    ]);

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      "metadata.isRead": false
    });

    res.json({
      totalNotifications,
      unreadCount,
      typeBreakdown: analytics,
      deliveryStats,
      readRate: totalNotifications > 0 ? (totalNotifications - unreadCount) / totalNotifications : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to create system notifications
export const createSystemNotification = async (recipientId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      title,
      message,
      priority: "normal",
      status: "unread",
      category: "system",
      relatedEntities: data,
      deliveryChannels: [
        { type: "in_app", sent: false },
        { type: "email", sent: false }
      ]
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating system notification:", error);
    return null;
  }
};

// Helper function to create expo-related notifications
export const createExpoNotification = async (recipientId, expoId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      expo: expoId,
      type,
      title,
      message,
      priority: "normal",
      status: "unread",
      category: "expo",
      relatedEntities: data,
      deliveryChannels: [
        { type: "in_app", sent: false },
        { type: "email", sent: false }
      ]
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating expo notification:", error);
    return null;
  }
};
