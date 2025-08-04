import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-web3.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Web3 Career Quest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90"></div>
        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
      </div>

      {/* Floating particles/elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-32 w-5 h-5 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-gradient-card px-6 py-2 text-xs shadow-glow">
            <Zap className="mr-2 h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Powered by Blockchain Technology</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Web3 Career
            </span>
            <br />
            <span className="text-foreground">Quest</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The future of professional networking. Connect, collaborate, and get paid in the decentralized economy.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Web3 Native</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-secondary rounded-full"></div>
              <span>Crypto Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <span>AI-Powered</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="web3" 
              size="xl" 
              className="shadow-primary hover:shadow-glow group"
              asChild
            >
              <Link to="/register">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="connect" 
              size="xl"
              asChild
            >
              <Link to="/dashboard">
                <Briefcase className="h-5 w-5" />
                Browse Jobs
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                5M+
              </div>
              <div className="text-sm text-muted-foreground">ETH Paid Out</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};