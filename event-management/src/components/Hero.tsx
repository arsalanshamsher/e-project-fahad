import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import heroImage from "@/assets/hero-illustration.jpg";

export const Hero = () => {
  return (
    <section className="bg-hero-gradient py-20 px-4 overflow-hidden">
      <Navigation />
      
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-block px-4 py-2 bg-gradient-secondary rounded-full mb-6">
              <span className="text-sm font-medium text-primary">✨ New: Advanced Analytics Dashboard</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Business</span>
              <br />
              With Smart Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Streamline operations, boost productivity, and accelerate growth with our comprehensive platform designed for modern businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="heroSecondary" size="xl" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Modern digital platform illustration" 
                className="w-full h-auto rounded-3xl shadow-large animate-float"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};