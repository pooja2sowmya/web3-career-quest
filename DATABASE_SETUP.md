# 🗄️ **DATABASE SETUP REQUIRED**

To complete the authentication and profile features, you need to create the `profiles` table in your Supabase database.

## **SQL Setup Script**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table to store additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  bio TEXT,
  linkedin_url TEXT,
  skills TEXT, -- JSON array stored as text, or comma-separated skills
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Create RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Allow public read access to profiles (for networking features)
CREATE POLICY "Allow public read access to profiles" ON profiles
  FOR SELECT USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## **How to Apply:**

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Paste the above SQL code
4. Click "Run" to execute

This will create the `profiles` table with proper Row Level Security (RLS) policies and automatic profile creation when users sign up.

## **Features Now Working:**

✅ **Email/Password Authentication** - Complete registration and login  
✅ **Profile Management** - Create and edit user profiles  
✅ **Wallet Integration** - MetaMask and Phantom wallet connection  
✅ **LinkedIn URL Support** - Store and display LinkedIn profiles  
✅ **Skills Management** - Add/remove skills with tags  
✅ **Responsive Design** - Beautiful Web3-themed UI  

After running the SQL, test the complete authentication flow by visiting `/login` or `/register`!