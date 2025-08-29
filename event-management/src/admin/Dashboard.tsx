import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AdminDashboard } from "./components/AdminDashboard";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { ExhibitorDashboard } from "./components/ExhibitorDashboard";
import { AttendeeDashboard } from "./components/AttendeeDashboard";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Mock user data - replace with actual authentication logic
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "admin", // This would come from your auth context
  avatar: "",
  company: "SmartFlow Inc",
  position: "System Administrator"
};

type UserRole = "admin" | "organizer" | "exhibitor" | "attendee";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  position?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to get user data
    const fetchUser = async () => {
      try {
        // TODO: Replace with actual authentication logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Redirect to login if authentication fails
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard user={user} />;
      case "organizer":
        return <OrganizerDashboard user={user} />;
      case "exhibitor":
        return <ExhibitorDashboard user={user} />;
      case "attendee":
        return <AttendeeDashboard user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navigation showAuthButtons={false} />
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
