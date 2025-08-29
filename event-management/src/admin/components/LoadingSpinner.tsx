import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block p-6 bg-glass-effect rounded-3xl shadow-large">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Dashboard
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your personalized experience...
          </p>
        </div>
      </div>
    </div>
  );
};
