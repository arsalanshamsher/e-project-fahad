import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

// Verify Token
export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based Access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
