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