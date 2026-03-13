# CareerRoad AI 🚀

**An AI-powered professional development platform that builds personalized learning roadmaps and tracks your journey to success.**

CareerRoad AI is a comprehensive full-stack platform designed for modern professionals and students. It uses advanced AI to analyze your career goals and generate a step-by-step, actionable roadmap. From tracking progress with interactive analytics to earning premium certifications, it's the ultimate tool for career growth.

---

## ✨ Features

- **🧠 Personalized AI Roadmaps**: Instantly generate structured learning paths for any career goal (e.g., AI Engineer, Cybersecurity Expert, Product Manager) using Google Gemini Pro AI.
- **🛡️ Secure & Hardened Auth**: Robust authentication system built with Supabase, featuring strong password policies (8+ characters, uppercase, lowercase, numbers) and real-time validation.
- **🔒 Email Verification**: Fully integrated email confirmation flow to ensure account security for new users.
- **📊 Interactive Analytics**: Professional dashboard with progress tracking, skill visualization using Recharts, and milestone management.
- **📜 Premium Certificates**: Unlock high-fidelity, royal-themed digital certificates upon completion (Pro Feature).
- **🎨 Elite Design**: Ultra-modern UI with glassmorphism, animated gradients, and premium typography using Tailwind CSS and Framer Motion.
- **📱 Responsive by Design**: Seamless experience across mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), TypeScript, Zod, Helmet.
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL).
- **AI Engine**: [Google Gemini Pro AI](https://ai.google.dev/).

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- Node.js (v18+)
- Supabase Project (with Email Auth enabled)
- Google AI (Gemini) API Key

### 2. Global Installation

```bash
# Clone the repository
git clone https://github.com/ashishjha1304/career-road-ai.git
cd career-road-ai

# Frontend Setup
cd frontend
npm install
cp .env.example .env.local  # Fill in Supabase & Backend URL

# Backend Setup
cd ../backend
npm install
cp .env.example .env        # Fill in Gemini & Supabase Keys
```

### 3. Running Locally

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 📂 Project Structure

```text
├── frontend/             # Next.js 14 Web Application
│   ├── src/app/          # Routes, Pages & Layouts
│   ├── src/components/   # Professional UI Components
│   └── src/lib/          # Supabase & Helper Utilities
├── backend/              # Node.js API Server
│   ├── src/controllers/  # Business Logic
│   ├── src/validators/   # Security & Data Validation
│   └── src/services/     # AI & Roadmap Generation
└── .gitignore            # Production-ready git ignores
```

---

## 💎 Pro Membership

Upgrade to Pro for just ₹49 to unlock:
- **Lifetime Access**: No monthly subscriptions.
- **AI Career Insights**: Advanced tips for your specific goals.
- **Printable Certificates**: High-quality PDF certificates to showcase your achievements.
- **Manual Verification**: Dedicated flow via UPI ID (`8591852039@fam`).

---

## 🤝 Project Owner

**Ashish Jha**
- **LinkedIn**: [Ashish Jha](https://www.linkedin.com/in/ashishjha1304/)
- **Email**: ashishjha1304@outlook.com
- **Website**: [careerroad-ai.vercel.app](https://careerroad-ai.vercel.app)

---

Developed with ❤️ by **Ashish Jha**. If you find this project helpful, don't forget to ⭐️ the repository!
