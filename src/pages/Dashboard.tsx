import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { JobCard } from "@/components/JobCard";
import { FeedCard } from "@/components/FeedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnectWallet = () => {
    // Mock wallet connection
    setIsWalletConnected(true);
    setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isConnected={isWalletConnected}
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
            <Button variant="web3" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
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
            <TabsTrigger value="jobs">Featured Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feedPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onLike={(id) => console.log("Liked post:", id)}
                  onComment={(id) => console.log("Commented on post:", id)}
                  onShare={(id) => console.log("Shared post:", id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={(id) => console.log("Applied to job:", id)}
                  onSave={(id) => console.log("Saved job:", id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};