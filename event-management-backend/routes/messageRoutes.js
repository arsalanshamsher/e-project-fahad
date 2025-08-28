import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { 
  sendMessage, 
  getInbox, 
  getSentMessages, 
  getMessageById, 
  markAsRead,
  markAsUnread,
  archiveMessage,
  unarchiveMessage,
  deleteMessage,
  getConversation,
  sendAnnouncement,
  getAnnouncements
} from "../controllers/messageController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Message routes
router.post("/", sendMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSentMessages);
router.get("/:id", getMessageById);
router.put("/:id/read", markAsRead);
router.put("/:id/unread", markAsUnread);
router.put("/:id/archive", archiveMessage);
router.put("/:id/unarchive", unarchiveMessage);
router.delete("/:id", deleteMessage);

// Conversation routes
router.get("/conversation/:userId", getConversation);

// Announcement routes (organizer/admin only)
router.post("/announcement", authorizeRoles("organizer", "admin"), sendAnnouncement);
router.get("/announcements", getAnnouncements);

export default router;
