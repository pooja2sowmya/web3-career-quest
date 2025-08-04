import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/supabase";

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  className?: string;
}

export const FeedCard = ({ post, onLike, onComment, onShare, className }: FeedCardProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job":
        return "text-primary";
      case "announcement":
        return "text-success";
      case "update":
        return "text-secondary";
      default:
        return "text-muted-foreground";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "job":
        return { label: "Job Posting", variant: "default" as const };
      case "announcement":
        return { label: "Announcement", variant: "secondary" as const };
      case "update":
        return { label: "Update", variant: "outline" as const };
      case "milestone":
        return { label: "Milestone", variant: "secondary" as const };
      default:
        return { label: "Post", variant: "outline" as const };
    }
  };

  const typeBadge = getTypeBadge(post.type);
  const author = post.profiles;
  const jobData = post.jobs;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-card border-border/40 bg-gradient-card",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className="h-10 w-10 border border-border/40">
              <AvatarImage src="" alt={author?.name || 'User'} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {author?.name ? author.name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-sm truncate">{author?.name || 'Anonymous'}</h4>
                {author?.wallet_address && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-background/50 border border-primary/20">
                    <div className="h-1.5 w-1.5 bg-success rounded-full"></div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatAddress(author.wallet_address)}
                    </span>
                  </div>
                )}
              </div>
              {author?.bio && (
                <p className="text-xs text-muted-foreground truncate">
                  {author.bio}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <Badge {...typeBadge} className="text-xs">
                  {typeBadge.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatTimestamp(post.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Job Details (if job post) */}
        {post.type === "job" && jobData && (
          <div className="p-4 rounded-lg bg-background/50 border border-primary/20 mb-4">
            <h5 className="font-semibold text-sm mb-2 text-primary">{jobData.title}</h5>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{jobData.location || 'Remote'}</span>
              </div>
              <div className="flex items-center space-x-1 text-success">
                <DollarSign className="h-3 w-3" />
                <span className="font-semibold">
                  {jobData.budget_min && jobData.budget_max 
                    ? `${jobData.budget_min}-${jobData.budget_max} ${jobData.currency}`
                    : `${jobData.currency} based`
                  }
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <ExternalLink className="h-3 w-3 mr-2" />
              View Job Details
            </Button>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-background/30 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(post.id)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="h-4 w-4 mr-1" />
              {post.likes_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const comment = prompt("Add a comment:");
                if (comment) onComment?.(post.id, comment);
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              {post.shares_count}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};