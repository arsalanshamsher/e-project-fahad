import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AdminDashboard } from "./components/AdminDashboard";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { ExhibitorDashboard } from "./components/ExhibitorDashboard";
import { AttendeeDashboard } from "./components/AttendeeDashboard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

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
