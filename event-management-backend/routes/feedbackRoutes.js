import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { 
  submitFeedback, 
  getFeedbackById, 
  updateFeedback, 
  deleteFeedback,
  getFeedbackByExpo,
  getFeedbackByUser,
  respondToFeedback,
  markFeedbackResolved,
  getFeedbackAnalytics,
  flagFeedback,
  getFeedbackCategories
} from "../controllers/feedbackController.js";

const router = express.Router();

// Public routes
router.get("/categories", getFeedbackCategories);

// Protected routes
router.use(authenticate);

// User routes
router.post("/", submitFeedback);
router.get("/user", getFeedbackByUser);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);
router.post("/:id/flag", flagFeedback);

// Organizer/Admin routes
router.get("/expo/:expoId", authorizeRoles("organizer", "admin"), getFeedbackByExpo);
router.post("/:id/respond", authorizeRoles("organizer", "admin"), respondToFeedback);
router.put("/:id/resolve", authorizeRoles("organizer", "admin"), markFeedbackResolved);
router.get("/analytics", authorizeRoles("organizer", "admin"), getFeedbackAnalytics);

export default router;
