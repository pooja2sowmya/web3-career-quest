import { useState, useEffect } from 'react';
import { supabase, Post } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            name,
            bio,
            linkedin_url,
            wallet_address
          ),
          jobs (
            title,
            budget_min,
            budget_max,
            currency,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Failed to load posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', postId)
        .eq('interaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike the post
        await supabase
          .from('post_interactions')
          .delete()
          .eq('id', existingLike.id);

        // Decrease likes count
        await supabase.rpc('decrement_post_likes', { post_id: postId });
      } else {
        // Like the post
        await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            interaction_type: 'like'
          });

        // Increase likes count
        await supabase.rpc('increment_post_likes', { post_id: postId });
      }

      // Refresh posts
      fetchPosts();
    } catch (error: any) {
      console.error('Error liking post:', error);
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const commentOnPost = async (postId: string, comment: string) => {
    try {
      await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          interaction_type: 'comment',
          comment_text: comment
        });

      // Increase comments count
      await supabase.rpc('increment_post_comments', { post_id: postId });

      toast({
        title: "Comment Added!",
        description: "Your comment has been posted.",
      });

      // Refresh posts
      fetchPosts();
    } catch (error: any) {
      console.error('Error commenting on post:', error);
      toast({
        title: "Comment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sharePost = async (postId: string) => {
    try {
      await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          interaction_type: 'share'
        });

      // Increase shares count
      await supabase.rpc('increment_post_shares', { post_id: postId });

      toast({
        title: "Post Shared!",
        description: "The post has been shared to your network.",
      });

      // Refresh posts
      fetchPosts();
    } catch (error: any) {
      console.error('Error sharing post:', error);
      toast({
        title: "Share Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    likePost,
    commentOnPost,
    sharePost
  };
};