# Web3 Career Quest 🌐💼

A **minimal full-stack Job & Networking Portal** inspired by LinkedIn, Upwork, and AngelList. Built with modern web technologies, this platform integrates **AI-powered features** for job matching and skill extraction, and **Web3 wallet support** for a decentralized identity experience.

### 🔗 Live Demo
Access the deployed application here:  
👉 [https://web3-career-quest.vercel.app/](https://web3-career-quest.vercel.app/)

---

## 🚀 Overview

Web3 Career Quest connects professionals through a decentralized platform that allows:

- ✅ Profile creation with manual or AI-based skill extraction
- ✅ Job posting and job discovery
- ✅ A public career-oriented feed (advice, updates, etc.)
- ✅ MetaMask/Phantom wallet authentication

---

## 🧩 Modules

### 📌 Module 1: Authentication & Profile Management

- 🔐 **User Registration & Login**
  - Session management using **JWT**
  - Web3 wallet login via **MetaMask** or **Phantom**
  
- 📝 **Profile Creation**
  - Name, bio, LinkedIn URL
  - Skills (entered manually or extracted via AI from bio/resume)
  - Public wallet address shown on profile

---

### 📌 Module 2: Job Posting & Feed

- ✅ **Job Posting (for authenticated users)**
  - Add job title, description, required skills, and budget/salary
- 📃 **Career Feed**
  - View job listings and posts (career tips, announcements, etc.)
- 🔍 **Filters**
  - Filter by **skills**, **location**, and **tags**
  
- 📦 **Secure Backend Storage**
  - All user and job data stored securely in the backend (e.g., Supabase/Firebase or custom backend)

---

## 🤖 AI/ML Integration

AI features enhance user interaction with:

- 🧠 **Skill Extraction**
  - NLP-powered skill extraction from user bios or resumes using LLMs (example: GPT API or custom model)
  
### Example Code Snippet (Skill Extraction)
```js
// Example (pseudo-code)
const extractSkills = async (bio) => {
  const response = await fetch('/api/ai/skills', {
    method: 'POST',
    body: JSON.stringify({ bio }),
  });
  const data = await response.json();
  return data.skills; // returns ['React', 'Node.js', 'Blockchain']
};
