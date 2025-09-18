import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-web3.jpg";

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const isWalletRegistration = searchParams.get('wallet') === 'true';

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    bio: "",
    linkedinUrl: "",
    skills: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  const { signUp, updateProfile, user } = useAuth();
  const { walletAddress, walletType, isConnected } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isWalletRegistration && isConnected && user) {
      setStep('profile');
    }
  }, [isWalletRegistration, isConnected, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (step === 'account' && !isWalletRegistration) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
        setError("Please fill in all required fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    return true;
  };

  const handleAccountStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setError(error.message);
        return;
      }
      // If email confirmation is required, no session will be returned
      if (!data?.session && !data?.user) {
        setNeedsEmailVerification(true);
        toast({
          title: 'Verify your email',
          description: 'We sent you a confirmation link. After verifying, sign in to continue.',
        });
        return;
      }
      toast({
        title: 'Account created!',
        description: 'You are signed in. Complete your profile.',
      });
      setStep('profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user) {
      setError('Please sign in after verifying your email to complete your profile.');
      setIsLoading(false);
      return;
    }

    try {
      const profileData = {
        name: formData.fullName,
        bio: formData.bio,
        linkedin_url: formData.linkedinUrl,
        skills: formData.skills,
        wallet_address: walletAddress || undefined,
      };

      await updateProfile(profileData);
      
      toast({
        title: "Profile completed!",
        description: "Welcome to Web3Careers",
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={heroImage} 
          alt="Web3 Career Quest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-hero opacity-40"></div>
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">
                Join the Revolution
              </h1>
              <p className="text-lg text-white/80">
                Build your Web3 career with blockchain professionals worldwide
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-white/90">Connect with verified professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-white/90">Get paid in cryptocurrency</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-white/90">Access exclusive Web3 opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Web3Careers
              </span>
            </div>
            <h2 className="text-3xl font-bold">
              {step === 'account' ? 'Create your account' : 'Complete your profile'}
            </h2>
            <p className="text-muted-foreground">
              {step === 'account' 
                ? 'Join thousands of Web3 professionals' 
                : 'Tell us about yourself to get started'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`h-2 w-8 rounded-full transition-colors ${
              step === 'account' ? 'bg-primary' : 'bg-success'
            }`}></div>
            <div className={`h-2 w-8 rounded-full transition-colors ${
              step === 'profile' ? 'bg-primary' : 'bg-muted'
            }`}></div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {needsEmailVerification && (
            <Alert>
              <AlertDescription>
                Please verify your email. After confirmation, sign in to complete your profile.
              </AlertDescription>
            </Alert>
          )}

          {isWalletRegistration && isConnected && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Wallet connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)} ({walletType})
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                {step === 'account' ? 'Account Information' : 'Profile Setup'}
              </CardTitle>
              <CardDescription>
                {step === 'account' 
                  ? 'Create your Web3Careers account'
                  : 'Help others find and connect with you'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 'account' && (!isWalletRegistration || !user) && (
                <form onSubmit={handleAccountStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="bg-background/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className="bg-background/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    variant="web3" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              )}

              {step === 'profile' && (
                <form onSubmit={handleProfileStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input
                      id="profileName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="bg-background/50 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="e.g., Solidity, React, Web3.js, TypeScript, Smart Contracts"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate skills with commas or new lines
                    </p>
                  </div>
                  {walletAddress && (
                    <div className="space-y-2">
                      <Label>Wallet Address</Label>
                      <div className="p-3 rounded-md bg-background/50 border border-border/40">
                        <p className="text-sm font-mono text-muted-foreground">
                          {walletAddress}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connected via {walletType}
                        </p>
                      </div>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    variant="web3" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};