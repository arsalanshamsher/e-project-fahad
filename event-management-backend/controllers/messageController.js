import Message from "../models/Message.js";
import User from "../models/User.js";
import Expo from "../models/Expo.js";
import { validationResult } from "express-validator";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient, expo, subject, content, type, priority, attachments } = req.body;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if expo exists (if provided)
    if (expo) {
      const expoExists = await Expo.findById(expo);
      if (!expoExists) {
        return res.status(404).json({ message: "Expo not found" });
      }
    }

    const message = new Message({
      sender: req.user.id,
      recipient,
      expo,
      subject,
      content,
      type: type || "direct",
      priority: priority || "normal",
      attachments: attachments || []
    });

    await message.save();

    // Populate sender and recipient details for response
    await message.populate("sender", "name company position avatar");
    await message.populate("recipient", "name company position avatar");

    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get inbox messages
export const getInbox = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, search } = req.query;
    
    let query = { recipient: req.user.id };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const messages = await Message.find(query)
      .populate("sender", "name company position avatar")
      .populate("expo", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get sent messages
export const getSentMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, search } = req.query;
    
    let query = { sender: req.user.id };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const messages = await Message.find(query)
      .populate("recipient", "name company position avatar")
      .populate("expo", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("sender", "name company position avatar")
      .populate("recipient", "name company position avatar")
      .populate("expo", "title startDate endDate location");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender or recipient
    if (message.sender._id.toString() !== req.user.id && 
        message.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Mark as read if recipient is viewing
    if (message.recipient._id.toString() === req.user.id && !message.metadata.isRead) {
      message.metadata.isRead = true;
      message.metadata.readAt = new Date();
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.metadata.isRead = true;
    message.metadata.readAt = new Date();
    await message.save();

    res.json({ message: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark all messages as read
export const markAllAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { recipient: req.user.id, "metadata.isRead": false },
      { 
        "metadata.isRead": true, 
        "metadata.readAt": new Date() 
      }
    );

    res.json({ message: "All messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark message as unread
export const markAsUnread = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.metadata.isRead = false;
    message.metadata.readAt = null;
    await message.save();

    res.json({ message: "Message marked as unread", message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Archive message
export const archiveMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id && 
        message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.metadata.isArchived = true;
    message.metadata.archivedAt = new Date();
    await message.save();

    res.json({ message: "Message archived", message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unarchive message
export const unarchiveMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id && 
        message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.metadata.isArchived = false;
    message.metadata.archivedAt = null;
    await message.save();

    res.json({ message: "Message unarchived", message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id && 
        message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get conversation with a specific user
export const getConversation = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const otherUserId = req.params.userId;

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    })
    .populate("sender", "name company position avatar")
    .populate("recipient", "name company position avatar")
    .populate("expo", "title")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    });

    // Mark messages from other user as read
    await Message.updateMany(
      { sender: otherUserId, recipient: req.user.id, "metadata.isRead": false },
      { 
        "metadata.isRead": true, 
        "metadata.readAt": new Date() 
      }
    );

    res.json({
      messages: messages.reverse(), // Show oldest first
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      otherUser: {
        id: otherUser._id,
        name: otherUser.name,
        company: otherUser.company,
        position: otherUser.position,
        avatar: otherUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send announcement (organizer/admin only)
export const sendAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { expo, subject, content, priority, scheduledFor } = req.body;

    // Check if expo exists
    if (expo) {
      const expoExists = await Expo.findById(expo);
      if (!expoExists) {
        return res.status(404).json({ message: "Expo not found" });
      }
    }

    // Get all users for the announcement
    let recipients = [];
    if (expo) {
      // Send to all users registered for this expo
      const expoUsers = await User.find({
        "expoRegistrations.expo": expo
      });
      recipients = expoUsers.map(user => user._id);
    } else {
      // Send to all users
      const allUsers = await User.find({});
      recipients = allUsers.map(user => user._id);
    }

    // Create announcement messages
    const announcements = recipients.map(recipientId => ({
      sender: req.user.id,
      recipient: recipientId,
      expo,
      subject,
      content,
      type: "announcement",
      priority: priority || "normal",
      scheduledFor: scheduledFor || new Date()
    }));

    await Message.insertMany(announcements);

    res.json({ 
      message: `Announcement sent to ${recipients.length} users`,
      recipientsCount: recipients.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get announcements
export const getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 20, expo } = req.query;
    
    let query = { 
      recipient: req.user.id,
      type: "announcement"
    };
    
    if (expo) query.expo = expo;

    const announcements = await Message.find(query)
      .populate("sender", "name company position avatar")
      .populate("expo", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
