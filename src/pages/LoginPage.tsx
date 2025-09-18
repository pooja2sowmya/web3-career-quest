import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Lock, Wallet, ExternalLink, Eye, EyeOff } from "lucide-react";
import heroImage from "@/assets/hero-web3.jpg";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'linkedin' | 'wallet'>('email');
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const { connectMetaMask, connectPhantom, isConnected, walletAddress } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Success!",
          description: "Welcome back to Web3Careers",
        });
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl) return;

    // For now, we'll create a temporary account with LinkedIn URL
    // In a real app, you'd validate the LinkedIn profile
    toast({
      title: "LinkedIn Login",
      description: "LinkedIn integration coming soon! Please use email registration.",
      variant: "default",
    });
  };

  const handleWalletLogin = async (walletType: 'metamask' | 'phantom') => {
    setIsLoading(true);
    setError("");

    try {
      if (walletType === 'metamask') {
        await connectMetaMask();
      } else {
        await connectPhantom();
      }
      
      toast({
        title: "Wallet Connected!",
        description: `Connected with ${walletType === 'metamask' ? 'MetaMask' : 'Phantom'}`,
      });
      
      // In a real app, you'd check if this wallet address is registered
      // For now, redirect to registration to complete profile
      navigate("/register?wallet=true");
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
                Welcome to the Future
              </h1>
              <p className="text-lg text-white/80">
                Connect, collaborate, and earn in the decentralized economy
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-success">5M+</div>
                <div className="text-sm text-white/70">ETH Paid</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-secondary">500+</div>
                <div className="text-sm text-white/70">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Web3Careers
              </span>
            </div>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={loginMethod === 'email' ? 'web3' : 'outline'}
              size="sm"
              onClick={() => setLoginMethod('email')}
              className="text-xs"
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button
              variant={loginMethod === 'linkedin' ? 'web3' : 'outline'}
              size="sm"
              onClick={() => setLoginMethod('linkedin')}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              LinkedIn
            </Button>
            <Button
              variant={loginMethod === 'wallet' ? 'web3' : 'outline'}
              size="sm"
              onClick={() => setLoginMethod('wallet')}
              className="text-xs"
            >
              <Wallet className="h-3 w-3 mr-1" />
              Wallet
            </Button>
          </div>

          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                {loginMethod === 'email' && 'Sign in with Email'}
                {loginMethod === 'linkedin' && 'Sign in with LinkedIn'}
                {loginMethod === 'wallet' && 'Connect your Wallet'}
              </CardTitle>
              <CardDescription>
                {loginMethod === 'email' && 'Enter your email and password'}
                {loginMethod === 'linkedin' && 'Enter your LinkedIn profile URL'}
                {loginMethod === 'wallet' && 'Connect with MetaMask or Phantom'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
                    Sign In
                  </Button>
                </form>
              )}

              {loginMethod === 'linkedin' && (
                <form onSubmit={handleLinkedInLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="web3" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue with LinkedIn
                  </Button>
                </form>
              )}

              {loginMethod === 'wallet' && (
                <div className="space-y-4">
                  {isConnected && walletAddress ? (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-center">
                      <div className="text-success font-semibold mb-2">Wallet Connected!</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <Button
                        variant="web3"
                        className="w-full mt-3"
                        onClick={() => navigate("/register?wallet=true")}
                      >
                        Continue to Registration
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="connect"
                        className="w-full"
                        onClick={() => handleWalletLogin('metamask')}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                          alt="MetaMask" 
                          className="w-5 h-5 mr-2"
                        />
                        Connect MetaMask
                      </Button>
                      <Button
                        variant="connect"
                        className="w-full"
                        onClick={() => handleWalletLogin('phantom')}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <div className="w-5 h-5 mr-2 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        Connect Phantom
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Separator />
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};