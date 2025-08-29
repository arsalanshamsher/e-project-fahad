import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role");
    
    const formattedUsers = users.map(user => ({
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
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
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
      }
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, company, position, address, status } = req.body;

    // Validate role
    const validRoles = ["admin", "organizer", "exhibitor", "attendee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Find or create role
    let roleData = await Role.findOne({ name: role });
    if (!roleData) {
      roleData = new Role({ name: role });
      await roleData.save();
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: roleData._id,
      company,
      position,
      address,
      status: status || 'active'
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, company, position, address, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (company) user.company = company;
    if (position) user.position = position;
    if (address) user.address = address;
    if (status) user.status = status;

    // Update role if provided
    if (role) {
      const validRoles = ["admin", "organizer", "exhibitor", "attendee"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      let roleData = await Role.findOne({ name: role });
      if (!roleData) {
        roleData = new Role({ name: role });
        await roleData.save();
      }
      user.role = roleData._id;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role || user.role
      }
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
