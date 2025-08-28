import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 29,
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 team members",
      "5GB storage",
      "Basic analytics",
      "Email support",
      "Mobile app access"
    ],
    featured: false
  },
  {
    name: "Pro", 
    price: 79,
    description: "Most popular for growing businesses",
    features: [
      "Up to 50 team members",
      "100GB storage", 
      "Advanced analytics",
      "Priority support",
      "Mobile app access",
      "Custom integrations",
      "API access"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited team members",
      "1TB storage",
      "Enterprise analytics",
      "24/7 phone support",
      "Mobile app access",
      "Custom integrations", 
      "API access",
      "SSO & advanced security",
      "Custom onboarding"
    ],
    featured: false
  }
];

export const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-gradient-secondary">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple, Transparent
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-background p-8 rounded-2xl border shadow-soft hover:shadow-medium transition-smooth animate-slide-up ${
                plan.featured ? 'pricing-card-featured border-primary' : 'border-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              
              <Button 
                variant={plan.featured ? "hero" : "outline"} 
                size="lg" 
                className="w-full mb-8"
              >
                {plan.featured ? "Start Free Trial" : "Get Started"}
              </Button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Need a custom plan? <a href="#" className="text-primary hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};