import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Wallet, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

interface JobPostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const JobPostForm = ({ onSuccess, onCancel }: JobPostFormProps) => {
  const { user } = useAuth();
  const { isConnected, walletAddress, connectMetaMask } = useWallet();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget_min: "",
    budget_max: "",
    currency: "USD",
    location: "",
    job_type: "full-time" as const,
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePayment = async () => {
    if (!isConnected || !walletAddress) {
      await connectMetaMask();
      return;
    }

    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Payment amount: 0.001 ETH
        const paymentAmount = ethers.parseEther("0.001");
        
        // Send payment to a platform wallet (you should replace this with your actual platform wallet)
        const platformWallet = "0x0000000000000000000000000000000000000000"; // Replace with actual wallet
        
        toast({
          title: "Payment Processing",
          description: "Please confirm the payment in your wallet...",
        });

        const tx = await signer.sendTransaction({
          to: platformWallet,
          value: paymentAmount,
        });

        toast({
          title: "Payment Sent",
          description: "Waiting for confirmation...",
        });

        const receipt = await tx.wait();
        
        // Store payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: user?.id,
            amount: 0.001,
            currency: 'ETH',
            transaction_hash: tx.hash,
            blockchain: 'ethereum',
            status: 'confirmed',
            block_number: receipt?.blockNumber,
            explorer_url: `https://etherscan.io/tx/${tx.hash}`
          });

        if (paymentError) throw paymentError;

        toast({
          title: "Payment Confirmed!",
          description: "Now submitting your job post...",
        });

        await submitJob(tx.hash);
        
      } else {
        throw new Error("MetaMask not found");
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const submitJob = async (transactionHash?: string) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
          budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
          currency: formData.currency,
          location: formData.location || null,
          job_type: formData.job_type,
          required_skills: skills,
          tags: tags,
          payment_confirmed: !!transactionHash,
          transaction_hash: transactionHash,
          blockchain: transactionHash ? 'ethereum' : null,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Create a feed post for the job
      await supabase
        .from('posts')
        .insert({
          user_id: user?.id,
          content: `🚀 New job posted: ${formData.title}${formData.location ? ` in ${formData.location}` : ''}`,
          type: 'job',
          tags: tags,
          job_id: data.id
        });

      toast({
        title: "Job Posted Successfully!",
        description: "Your job is now live and visible to candidates.",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Job submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a job",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentStep(true);
  };

  if (paymentStep) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-card border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Payment Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              To ensure quality and prevent spam, there's a small platform fee for job posts.
            </p>
            <div className="text-2xl font-bold text-primary">0.001 ETH</div>
            <p className="text-xs text-muted-foreground">
              (~$2-5 USD depending on current ETH price)
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handlePayment}
              className="w-full"
              variant="web3"
              disabled={isSubmitting}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnected ? "Pay & Post Job" : "Connect Wallet & Pay"}
            </Button>
            
            <Button 
              onClick={() => setPaymentStep(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Post a New Job</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Job Title *</label>
            <Input
              placeholder="e.g. Senior Blockchain Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background/50 border-border/40"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background/50 border-border/40 min-h-[120px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Min Budget</label>
            <Input
              type="number"
              placeholder="50000"
              value={formData.budget_min}
              onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
              className="bg-background/50 border-border/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Max Budget</label>
            <Input
              type="number"
              placeholder="80000"
              value={formData.budget_max}
              onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
              className="bg-background/50 border-border/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Currency</label>
            <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
              <SelectTrigger className="bg-background/50 border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Job Type</label>
            <Select value={formData.job_type} onValueChange={(value: any) => setFormData({ ...formData, job_type: value })}>
              <SelectTrigger className="bg-background/50 border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="e.g. Remote, San Francisco, CA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-background/50 border-border/40"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Required Skills</label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="bg-background/50 border-border/40"
              />
              <Button onClick={addSkill} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="bg-background/50 border-border/40"
              />
              <Button onClick={addTag} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            variant="web3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue to Payment"}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};