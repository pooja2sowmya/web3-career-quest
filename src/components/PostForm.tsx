import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PostForm = ({ onSuccess, onCancel }: PostFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState("");
  const [type, setType] = useState<'update' | 'announcement' | 'milestone'>('update');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post an update",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please write something to share",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          type: type,
          tags: tags
        });

      if (error) throw error;

      toast({
        title: "Post Created!",
        description: "Your update has been shared with the community.",
      });

      // Reset form
      setContent("");
      setType('update');
      setTags([]);
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Post submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Share an Update</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Post Type</label>
          <Select value={type} onValueChange={(value: any) => setType(value)}>
            <SelectTrigger className="bg-background/50 border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="update">General Update</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Content *</label>
          <Textarea
            placeholder="What's happening? Share your thoughts, announcements, or milestones..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-background/50 border-border/40 min-h-[120px]"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right mt-1">
            {content.length}/500 characters
          </div>
        </div>

        <div>
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
                <span>#{tag}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            variant="web3"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Posting..." : "Share Update"}
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