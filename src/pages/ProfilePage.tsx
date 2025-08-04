import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, User, Wallet, ExternalLink, Plus, X, Camera } from "lucide-react";

export const ProfilePage = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const { walletAddress, walletType, isConnected, connectMetaMask, connectPhantom } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    linkedin_url: "",
    skills: "",
  });
  
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        linkedin_url: profile.linkedin_url || "",
        skills: profile.skills || "",
      });
      
      // Parse skills into tags
      if (profile.skills) {
        const skills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
        setSkillTags(skills);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skillTags.includes(newSkill.trim())) {
      const updatedSkills = [...skillTags, newSkill.trim()];
      setSkillTags(updatedSkills);
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills.join(', ')
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skillTags.filter(skill => skill !== skillToRemove);
    setSkillTags(updatedSkills);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills.join(', ')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const profileUpdate = {
        ...formData,
        wallet_address: walletAddress || profile?.wallet_address || undefined,
      };

      await updateProfile(profileUpdate);
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async (walletType: 'metamask' | 'phantom') => {
    try {
      if (walletType === 'metamask') {
        await connectMetaMask();
      } else {
        await connectPhantom();
      }
      
      toast({
        title: "Wallet connected!",
        description: `Successfully connected ${walletType}`,
      });
    } catch (err: any) {
      toast({
        title: "Connection failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={() => handleConnectWallet('metamask')}
        onDisconnect={() => {}}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your Web3 career profile and connect with opportunities
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border/40 sticky top-24">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src="" alt={formData.name} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                        {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{formData.name || "Your Name"}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Wallet Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Wallet Status</Label>
                    {isConnected && walletAddress ? (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-2 w-2 bg-success rounded-full"></div>
                          <span className="text-sm font-medium text-success">Connected</span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">
                          {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          via {walletType}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="connect"
                          size="sm"
                          className="w-full"
                          onClick={() => handleConnectWallet('metamask')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect MetaMask
                        </Button>
                        <Button
                          variant="connect"
                          size="sm"
                          className="w-full"
                          onClick={() => handleConnectWallet('phantom')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Phantom
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Skills Preview */}
                  {skillTags.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Skills</Label>
                      <div className="flex flex-wrap gap-1">
                        {skillTags.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {skillTags.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{skillTags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself, your experience, and what you're looking for in the Web3 space..."
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="bg-background/50 min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <div className="relative">
                          <Input
                            id="linkedin"
                            type="url"
                            placeholder="https://www.linkedin.com/in/yourprofile"
                            value={formData.linkedin_url}
                            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                            className="bg-background/50 pr-10"
                          />
                          {formData.linkedin_url && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => window.open(formData.linkedin_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Skills & Expertise</h3>
                      
                      <div className="space-y-2">
                        <Label>Add Skills</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="e.g., Solidity, React, Web3.js"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="bg-background/50"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSkill}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {skillTags.length > 0 && (
                        <div className="space-y-2">
                          <Label>Your Skills</Label>
                          <div className="flex flex-wrap gap-2">
                            {skillTags.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-colors"
                              >
                                {skill}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => removeSkill(skill)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="web3"
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};