import { useState, useEffect } from 'react';
import { supabase, Job } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_user_id_fkey (
            name,
            linkedin_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Failed to load jobs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, coverLetter?: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          cover_letter: coverLetter
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the employer.",
      });

      return true;
    } catch (error: any) {
      console.error('Error applying to job:', error);
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const saveJob = async (jobId: string) => {
    // This would typically save to a user_saved_jobs table
    // For now, we'll just show a toast
    toast({
      title: "Job Saved!",
      description: "You can view your saved jobs in your profile.",
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    applyToJob,
    saveJob
  };
};