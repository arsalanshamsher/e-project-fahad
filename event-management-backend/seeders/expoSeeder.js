import mongoose from "mongoose";
import dotenv from "dotenv";
import Expo from "../models/Expo.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expo_db";

const sampleExpos = [
  {
    title: "Tech Innovation Summit 2024",
    description: "Join us for the biggest technology innovation event of the year. Discover cutting-edge solutions, network with industry leaders, and explore the future of technology.",
    theme: "Innovation & Technology",
    startDate: new Date("2024-12-15"),
    endDate: new Date("2024-12-17"),
    location: {
      venue: "Convention Center",
      address: "123 Innovation Drive",
      city: "San Francisco",
      country: "USA",
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    status: "published",
    capacity: {
      maxAttendees: 1000,
      maxExhibitors: 50,
      maxBooths: 60
    },
    pricing: {
      attendeePrice: 299,
      exhibitorPrice: 1500,
      earlyBirdDiscount: 20,
      earlyBirdEndDate: new Date("2024-10-31")
    },
    categories: ["Technology", "Innovation", "Startups"],
    tags: ["AI", "Machine Learning", "Blockchain", "IoT"],
    settings: {
      allowPublicRegistration: true,
      requireApproval: false,
      maxBoothsPerExhibitor: 2,
      allowBoothSharing: false
    },
    statistics: {
      registeredAttendees: 450,
      registeredExhibitors: 25,
      boothOccupancy: 42,
      totalRevenue: 37500
    }
  },
  {
    title: "Healthcare Excellence Conference",
    description: "A comprehensive healthcare conference bringing together medical professionals, researchers, and healthcare technology innovators to discuss the latest advancements in medical care.",
    theme: "Healthcare & Medical Innovation",
    startDate: new Date("2024-11-20"),
    endDate: new Date("2024-11-22"),
    location: {
      venue: "Medical Center Auditorium",
      address: "456 Health Avenue",
      city: "Boston",
      country: "USA",
      coordinates: {
        lat: 42.3601,
        lng: -71.0589
      }
    },
    status: "active",
    capacity: {
      maxAttendees: 500,
      maxExhibitors: 30,
      maxBooths: 35
    },
    pricing: {
      attendeePrice: 199,
      exhibitorPrice: 1200,
      earlyBirdDiscount: 15,
      earlyBirdEndDate: new Date("2024-09-30")
    },
    categories: ["Healthcare", "Medical", "Research"],
    tags: ["Telemedicine", "AI in Healthcare", "Medical Devices", "Research"],
    settings: {
      allowPublicRegistration: true,
      requireApproval: true,
      maxBoothsPerExhibitor: 1,
      allowBoothSharing: false
    },
    statistics: {
      registeredAttendees: 320,
      registeredExhibitors: 18,
      boothOccupancy: 51,
      totalRevenue: 21600
    }
  },
  {
    title: "Green Energy Expo",
    description: "Explore sustainable energy solutions and renewable technologies. Connect with green energy companies and learn about the future of sustainable power generation.",
    theme: "Sustainable Energy & Green Technology",
    startDate: new Date("2025-01-25"),
    endDate: new Date("2025-01-27"),
    location: {
      venue: "Eco Convention Hall",
      address: "789 Green Street",
      city: "Portland",
      country: "USA",
      coordinates: {
        lat: 45.5152,
        lng: -122.6784
      }
    },
    status: "draft",
    capacity: {
      maxAttendees: 800,
      maxExhibitors: 40,
      maxBooths: 45
    },
    pricing: {
      attendeePrice: 149,
      exhibitorPrice: 800,
      earlyBirdDiscount: 25,
      earlyBirdEndDate: new Date("2024-12-31")
    },
    categories: ["Energy", "Sustainability", "Environment"],
    tags: ["Solar", "Wind", "Hydrogen", "Battery Storage", "Smart Grid"],
    settings: {
      allowPublicRegistration: false,
      requireApproval: true,
      maxBoothsPerExhibitor: 1,
      allowBoothSharing: false
    },
    statistics: {
      registeredAttendees: 0,
      registeredExhibitors: 0,
      boothOccupancy: 0,
      totalRevenue: 0
    }
  },
  {
    title: "Education Technology Fair",
    description: "Discover the latest educational technologies and digital learning solutions. Perfect for educators, administrators, and edtech companies.",
    theme: "Digital Learning & Educational Technology",
    startDate: new Date("2024-10-10"),
    endDate: new Date("2024-10-12"),
    location: {
      venue: "University Conference Center",
      address: "321 Education Boulevard",
      city: "Austin",
      country: "USA",
      coordinates: {
        lat: 30.2672,
        lng: -97.7431
      }
    },
    status: "completed",
    capacity: {
      maxAttendees: 600,
      maxExhibitors: 35,
      maxBooths: 40
    },
    pricing: {
      attendeePrice: 99,
      exhibitorPrice: 600,
      earlyBirdDiscount: 30,
      earlyBirdEndDate: new Date("2024-08-15")
    },
    categories: ["Education", "Technology", "Digital Learning"],
    tags: ["Online Learning", "VR/AR", "Gamification", "Assessment Tools", "LMS"],
    settings: {
      allowPublicRegistration: true,
      requireApproval: false,
      maxBoothsPerExhibitor: 1,
      allowBoothSharing: false
    },
    statistics: {
      registeredAttendees: 580,
      registeredExhibitors: 32,
      boothOccupancy: 80,
      totalRevenue: 18900
    }
  }
];

async function seedExpos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing expos
    await Expo.deleteMany({});
    console.log("Cleared existing expos");

    // First, find or create the admin role
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      console.log("Admin role not found, creating it...");
      adminRole = await Role.create({ name: "admin" });
      console.log("Created admin role");
    }

    // Find an admin user to set as organizer
    const adminUser = await User.findOne({ role: adminRole._id });
    if (!adminUser) {
      console.log("No admin user found with admin role. Please create an admin user first.");
      console.log("You can create one by registering a user and then updating their role in the database.");
      return;
    }

    console.log(`Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Add organizer to each expo
    const exposWithOrganizer = sampleExpos.map(expo => ({
      ...expo,
      organizer: adminUser._id
    }));

    // Insert sample expos
    const result = await Expo.insertMany(exposWithOrganizer);
    console.log(`Successfully seeded ${result.length} expos`);

    // Display created expos
    result.forEach(expo => {
      console.log(`- ${expo.title} (${expo.status})`);
    });

  } catch (error) {
    console.error("Error seeding expos:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedExpos();
}

export default seedExpos;
