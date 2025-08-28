import { BarChart3, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights into your business performance with real-time analytics and comprehensive reporting tools."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with global CDN, ensuring your applications load instantly anywhere in the world."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless collaboration tools that keep your team connected and productive across all projects."
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need to streamline your workflow and achieve your business goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card bg-card p-8 rounded-2xl border border-border shadow-soft hover:shadow-medium group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};