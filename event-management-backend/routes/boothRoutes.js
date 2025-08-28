import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
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
router.post("/", authorizeRoles("organizer", "admin"), createBooth);
router.put("/:id", authorizeRoles("organizer", "admin"), updateBooth);
router.delete("/:id", authorizeRoles("organizer", "admin"), deleteBooth);
router.get("/expo/:expoId/analytics", authorizeRoles("organizer", "admin"), getBoothAnalytics);

// Exhibitor routes
router.post("/:id/book", authorizeRoles("exhibitor"), bookBooth);
router.post("/:id/cancel", authorizeRoles("exhibitor"), cancelBoothBooking);

export default router;
