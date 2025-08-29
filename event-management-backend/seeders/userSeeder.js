import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Role from "../models/Role.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expo_db";

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    company: "EventSphere",
    position: "System Administrator",
    bio: "System administrator with full access to all features",
    isActive: true
  },
  {
    name: "Organizer User",
    email: "organizer@example.com",
    password: "organizer123",
    company: "EventPro",
    position: "Event Organizer",
    bio: "Professional event organizer with experience in large-scale events",
    isActive: true
  },
  {
    name: "Exhibitor User",
    email: "exhibitor@example.com",
    password: "exhibitor123",
    company: "TechCorp",
    position: "Marketing Manager",
    bio: "Marketing professional looking to showcase products at events",
    isActive: true
  }
];

const roles = [
  { name: "admin" },
  { name: "organizer" },
  { name: "exhibitor" },
  { name: "attendee" }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Create roles first
    console.log("Creating roles...");
    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }

    // Get role references
    const adminRole = await Role.findOne({ name: "admin" });
    const organizerRole = await Role.findOne({ name: "organizer" });
    const exhibitorRole = await Role.findOne({ name: "exhibitor" });
    const attendeeRole = await Role.findOne({ name: "attendee" });

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users with appropriate roles
    const usersToCreate = [
      { ...sampleUsers[0], role: adminRole._id },
      { ...sampleUsers[1], role: organizerRole._id },
      { ...sampleUsers[2], role: exhibitorRole._id }
    ];

    // Hash passwords and create users
    for (const userData of usersToCreate) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created user: ${user.name} (${user.email}) with role: ${userData.role === adminRole._id ? 'admin' : userData.role === organizerRole._id ? 'organizer' : 'exhibitor'}`);
    }

    console.log("User seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers();
}

export default seedUsers;
