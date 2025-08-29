import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  showAuthButtons?: boolean;
}

export const Navigation = ({ showAuthButtons = true }: NavigationProps) => {
  return (
    <nav className="w-full py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            SmartFlow
          </Link>
          
          {showAuthButtons && (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
