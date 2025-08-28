import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpiry } from "../config/jwt.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // role check
    const roleData = await Role.findOne({ name: role });
    if (!roleData) return res.status(400).json({ message: "Invalid role" });

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

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
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
