import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { 
  getNotifications, 
  getNotificationById, 
  markAsRead, 
  markAllAsRead,
  markAsUnread,
  archiveNotification,
  unarchiveNotification,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  sendNotification,
  getNotificationAnalytics
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Notification routes
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.put("/:id/read", markAsRead);
router.put("/:id/unread", markAsUnread);
router.put("/:id/archive", archiveNotification);
router.put("/:id/unarchive", unarchiveNotification);
router.delete("/:id", deleteNotification);

// Bulk operations
router.put("/mark-all-read", markAllAsRead);

// Settings
router.get("/settings", getNotificationSettings);
router.put("/settings", updateNotificationSettings);

// Admin/Organizer routes
router.post("/send", authorizeRoles("organizer", "admin"), sendNotification);
router.get("/analytics", authorizeRoles("organizer", "admin"), getNotificationAnalytics);

export default router;
