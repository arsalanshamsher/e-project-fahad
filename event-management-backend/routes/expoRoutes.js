import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { 
  createExpo, 
  getAllExpos, 
  getExpoById, 
  updateExpo, 
  deleteExpo,
  publishExpo,
  unpublishExpo,
  getExpoAnalytics,
  getExpoStatistics,
  searchExpos,
  getExposByCategory,
  getExposByLocation,
  getUpcomingExpos,
  getExposByOrganizer,
  registerForExpo,
  cancelExpoRegistration,
  getExpoAttendees,
  getExpoExhibitors,
  uploadExpoImage,
  deleteExpoImage
} from "../controllers/expoController.js";

const router = express.Router();

// Public routes
router.get("/", getAllExpos);
router.get("/search", searchExpos);
router.get("/category/:category", getExposByCategory);
router.get("/location/:city", getExposByLocation);
router.get("/upcoming", getUpcomingExpos);
router.get("/:id", getExpoById);

// Protected routes
router.use(authenticate);

// Attendee/Exhibitor routes
router.post("/:id/register", registerForExpo);
router.post("/:id/cancel", cancelExpoRegistration);

// Organizer/Admin routes
router.post("/", authorizeRoles("organizer", "admin"), createExpo);
router.put("/:id", authorizeRoles("organizer", "admin"), updateExpo);
router.delete("/:id", authorizeRoles("organizer", "admin"), deleteExpo);
router.put("/:id/publish", authorizeRoles("organizer", "admin"), publishExpo);
router.put("/:id/unpublish", authorizeRoles("organizer", "admin"), unpublishExpo);
router.get("/:id/analytics", authorizeRoles("organizer", "admin"), getExpoAnalytics);
router.get("/:id/statistics", authorizeRoles("organizer", "admin"), getExpoStatistics);
router.get("/:id/attendees", authorizeRoles("organizer", "admin"), getExpoAttendees);
router.get("/:id/exhibitors", authorizeRoles("organizer", "admin"), getExpoExhibitors);
router.post("/:id/images", authorizeRoles("organizer", "admin"), uploadExpoImage);
router.delete("/:id/images/:imageId", authorizeRoles("organizer", "admin"), deleteExpoImage);

// Organizer can see their own expos
router.get("/organizer/me", authorizeRoles("organizer", "admin"), getExposByOrganizer);

export default router;
