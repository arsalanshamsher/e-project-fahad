import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "API", "Integrations"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "Tutorials"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
};

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartFlow
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Transform your business with our comprehensive platform designed for modern teams. Join thousands of companies already using SmartFlow.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SmartFlow. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for modern businesses
          </p>
        </div>
      </div>
    </footer>
  );
};