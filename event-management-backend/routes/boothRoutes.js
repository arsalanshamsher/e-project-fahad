import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { validateBooth, validateBoothUpdate } from "../middleware/boothValidation.js";
import { 
  getAllBooths, 
  getBoothById, 
  createBooth, 
  updateBooth, 
  deleteBooth,
  bookBooth,
  cancelBoothBooking,
  getBoothsByExpo,
  getAvailableBooths,
  getBoothAnalytics
} from "../controllers/boothController.js";

const router = express.Router();

// Public routes
router.get("/expo/:expoId", getAllBooths);
router.get("/expo/:expoId/available", getAvailableBooths);
router.get("/:id", getBoothById);

// Protected routes
router.use(authenticate);

// Organizer/Admin routes
router.get("/", authorizeRoles("organizer", "admin"), getAllBooths);
router.post("/", authorizeRoles("organizer", "admin"), validateBooth, createBooth);
router.put("/:id", authorizeRoles("organizer", "admin"), validateBoothUpdate, updateBooth);
router.delete("/:id", authorizeRoles("organizer", "admin"), deleteBooth);
router.get("/expo/:expoId/analytics", authorizeRoles("organizer", "admin"), getBoothAnalytics);

// Exhibitor routes
router.post("/:id/book", authorizeRoles("exhibitor"), bookBooth);
router.post("/:id/cancel", authorizeRoles("exhibitor"), cancelBoothBooking);

export default router;
