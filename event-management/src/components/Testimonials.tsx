import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    content: "This platform has completely transformed how we manage our operations. The intuitive interface and powerful features have increased our productivity by 40%.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez", 
    role: "CTO, InnovateLab",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The analytics dashboard gives us insights we never had before. It's like having a crystal ball for our business decisions. Absolutely game-changing!",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Director, GrowthCorp", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "From setup to scaling, everything just works seamlessly. The customer support is exceptional, and the platform grows with our business needs.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Loved by
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience with our platform.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl border border-border shadow-soft hover:shadow-medium transition-smooth animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};