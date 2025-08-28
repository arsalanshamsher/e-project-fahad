import { UserPlus, Settings, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign Up & Setup",
    description: "Create your account in seconds and let our smart setup wizard configure everything for your business needs."
  },
  {
    icon: Settings,
    number: "02", 
    title: "Customize & Configure",
    description: "Tailor the platform to match your workflow with our intuitive drag-and-drop interface and powerful customization options."
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Grow & Scale", 
    description: "Watch your business thrive with actionable insights, automated workflows, and seamless integrations that grow with you."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-secondary">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How It
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process designed to get you up and running quickly.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-medium group-hover:shadow-large transition-smooth">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{step.number}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-primary transform -translate-y-1/2 translate-x-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};