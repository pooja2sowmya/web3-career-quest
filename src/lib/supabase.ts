import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aalperydzzabjntmtcuz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbHBlcnlkenphYmpudG10Y3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMzM0OTMsImV4cCI6MjA2OTYwOTQ5M30.3FllGHASYEJ6d2aSKXX-uN6HzDmaTECMIrE8vWVwnLI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  user_id: string
  name?: string
  bio?: string
  linkedin_url?: string
  skills?: string
  wallet_address?: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  title: string
  description: string
  budget_min?: number
  budget_max?: number
  currency: string
  location?: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  required_skills: string[]
  tags: string[]
  status: 'active' | 'closed' | 'draft'
  payment_confirmed: boolean
  transaction_hash?: string
  blockchain?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  type: 'update' | 'announcement' | 'job' | 'milestone'
  tags: string[]
  job_id?: string
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
  // Joined data
  profiles?: Profile
  jobs?: Job
}

export interface PostInteraction {
  id: string
  user_id: string
  post_id: string
  interaction_type: 'like' | 'comment' | 'share'
  comment_text?: string
  created_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  user_id: string
  status: 'applied' | 'reviewing' | 'accepted' | 'rejected'
  cover_letter?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  job_id?: string
  amount: number
  currency: string
  transaction_hash: string
  blockchain: string
  status: 'pending' | 'confirmed' | 'failed'
  block_number?: number
  gas_fee?: number
  explorer_url?: string
  created_at: string
  updated_at: string
}