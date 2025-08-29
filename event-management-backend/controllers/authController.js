import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpiry } from "../config/jwt.js";

// Register
export const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    const { name, email, password, phone, role } = req.body;

    // Validate role
    const validRoles = ["admin", "organizer", "exhibitor", "attendee"];
    console.log("Received role:", role, "Valid roles:", validRoles);
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be one of: " + validRoles.join(", ") });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Find or create role
    let roleData = await Role.findOne({ name: role });
    if (!roleData) {
      // Create the role if it doesn't exist
      roleData = new Role({ name: role });
      await roleData.save();
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: roleData._id
    });

    await user.save();

    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role.name },
      jwtSecret,
      { expiresIn: jwtExpiry }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        company: user.company,
        position: user.position,
        address: user.address,
        status: user.status,
        createdAt: user.createdAt
      },
      token: req.headers.authorization?.split(' ')[1] // Return current token
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
