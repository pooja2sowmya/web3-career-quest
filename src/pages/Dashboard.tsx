import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { JobCard } from "@/components/JobCard";
import { FeedCard } from "@/components/FeedCard";
import { JobPostForm } from "@/components/JobPostForm";
import { PostForm } from "@/components/PostForm";
import { useJobs } from "@/hooks/useJobs";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Plus, TrendingUp, Briefcase, Users, Zap } from "lucide-react";

// Mock data
const featuredJobs = [
  {
    id: "1",
    title: "Senior Blockchain Developer",
    company: "DeFi Protocol",
    location: "Remote",
    salary: "150k - 200k USDC",
    type: "Full-time" as const,
    skills: ["Solidity", "React", "Web3.js", "TypeScript"],
    description: "Build the future of decentralized finance with our cutting-edge DeFi protocol. Looking for experienced blockchain developers.",
    postedAt: "2 hours ago",
    featured: true,
  },
  {
    id: "2",
    title: "Web3 Frontend Engineer",
    company: "MetaVerse Corp",
    location: "San Francisco, CA",
    salary: "120k - 160k USD",
    type: "Full-time" as const,
    skills: ["React", "Next.js", "Ethers.js", "Wagmi"],
    description: "Create immersive Web3 experiences for the next generation of internet users. Work with cutting-edge technologies.",
    postedAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Smart Contract Auditor",
    company: "SecureChain",
    location: "Remote",
    salary: "0.5 - 1 ETH per audit",
    type: "Contract" as const,
    skills: ["Solidity", "Security", "Foundry", "Hardhat"],
    description: "Help secure the Web3 ecosystem by auditing smart contracts for vulnerabilities and best practices.",
    postedAt: "1 day ago",
  }
];

const feedPosts = [
  {
    id: "1",
    type: "job" as const,
    author: {
      name: "Alice Chen",
      avatar: "",
      company: "DeFi Protocol",
      title: "Head of Engineering",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
    },
    content: "We're excited to announce we're hiring a Senior Blockchain Developer! Join our mission to democratize finance through DeFi.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 5,
    tags: ["hiring", "blockchain", "defi"],
    jobData: {
      title: "Senior Blockchain Developer",
      salary: "150k - 200k USDC",
      location: "Remote"
    }
  },
  {
    id: "2",
    type: "announcement" as const,
    author: {
      name: "Bob Wilson",
      avatar: "",
      company: "Web3 Startup",
      title: "Founder & CEO",
    },
    content: "Just launched our MVP! 🚀 Thanks to our amazing team of Web3 developers. Looking forward to the next phase of growth.",
    timestamp: "4 hours ago",
    likes: 67,
    comments: 15,
    shares: 12,
    tags: ["launch", "milestone", "web3"]
  },
  {
    id: "3",
    type: "update" as const,
    author: {
      name: "Sarah Johnson",
      avatar: "",
      title: "Smart Contract Developer",
    },
    content: "Completed another successful smart contract audit today. The Web3 security landscape keeps evolving - always learning something new!",
    timestamp: "6 hours ago",
    likes: 43,
    comments: 7,
    shares: 3,
    tags: ["security", "smartcontracts", "learning"]
  }
];

export const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { isConnected, walletAddress, connectMetaMask, disconnect } = useWallet();
  const { jobs, loading: jobsLoading, applyToJob, saveJob } = useJobs();
  const { posts, loading: postsLoading, likePost, commentOnPost, sharePost } = usePosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    connectMetaMask();
  };

  const handleDisconnect = () => {
    disconnect();
    signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isConnected={isConnected && !!walletAddress}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnect={handleDisconnect}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, skills, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gradient-card border-border/40"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
              <DialogTrigger asChild>
                <Button variant="web3" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <JobPostForm 
                  onSuccess={() => setShowJobForm(false)}
                  onCancel={() => setShowJobForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,234</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <Zap className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">5.2M USDC</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professionals</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">10,567</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">94.5%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gradient-card">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex justify-center mb-6">
              <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
                <DialogTrigger asChild>
                  <Button variant="web3" className="w-full max-w-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Share an Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <PostForm 
                    onSuccess={() => setShowPostForm(false)}
                    onCancel={() => setShowPostForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            {postsLoading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={likePost}
                    onComment={commentOnPost}
                    onShare={sharePost}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {jobsLoading ? (
              <div className="text-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading jobs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={applyToJob}
                    onSave={saveJob}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};