import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { 
  getAllSessions, 
  getSessionById, 
  createSession, 
  updateSession, 
  deleteSession,
  registerForSession,
  cancelSessionRegistration,
  getSessionsByExpo,
  getSessionsBySpeaker,
  getSessionAnalytics,
  addSessionFeedback
} from "../controllers/sessionController.js";

const router = express.Router();

// Public routes
router.get("/expo/:expoId", getSessionsByExpo);
router.get("/:id", getSessionById);

// Protected routes
router.use(authenticate);

// Organizer/Admin routes
router.post("/", authorizeRoles("organizer", "admin"), createSession);
router.put("/:id", authorizeRoles("organizer", "admin"), updateSession);
router.delete("/:id", authorizeRoles("organizer", "admin"), deleteSession);
router.get("/expo/:expoId/analytics", authorizeRoles("organizer", "admin"), getSessionAnalytics);

// Attendee/Exhibitor routes
router.post("/:id/register", authorizeRoles("attendee", "exhibitor"), registerForSession);
router.post("/:id/cancel", authorizeRoles("attendee", "exhibitor"), cancelSessionRegistration);
router.post("/:id/feedback", authorizeRoles("attendee", "exhibitor"), addSessionFeedback);

// Speaker routes
router.get("/speaker/:speakerId", getSessionsBySpeaker);

export default router;
