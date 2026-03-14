# CareerRoad AI 🚀
**The Ultimate AI-Powered Navigator for Your Professional Journey.**

CareerRoad AI is a state-of-the-art, full-stack career development platform that bridges the gap between ambition and reality. By leveraging Google's Gemini Pro AI, it generates hyper-personalized, actionable learning roadmaps tailored to your unique goals. Whether you're an aspiring AI Engineer or a future Product Leader, CareerRoad AI provides the blueprint for your success.

---

## 🌟 Why CareerRoad AI?

In today's fast-paced world, finding the right learning path is harder than ever. CareerRoad AI simplifies this journey by:
- **Removing Guesswork**: No more "what should I learn next?".
- **Tracking Growth**: Visualize your progress with intuitive analytics.
- **Rewarding Excellence**: Earn high-fidelity certificates to showcase your milestones.

---

## ✨ Key Features

- **🧠 Intelligent Roadmap Architect**: Instantly generate structured, step-by-step learning paths using **Google Gemini Pro AI**.
- **🛡️ Enterprise-Grade Security**: robust auth system powered by **Supabase**, featuring hardened password policies and real-time validation.
- **📧 Verified Onboarding**: Integrated email confirmation flow ensures a secure and trustworthy user community.
- **📊 Real-time Progress Tracking**: Interactive dashboard built with **Recharts** to visualize skill acquisition and milestone completion.
- **💎 Royal Certification System**: Unlock exclusive, printable high-fidelity certificates (Pro Feature) to boost your professional profile.
- **🎨 Premium Visual Experience**: A stunning UI/UX crafted with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**, featuring glassmorphism and animated mesh gradients.
- **📱 Fluid Responsiveness**: Optimized for a flawless experience from the smallest mobile device to the largest desktop monitor.

---

## 🛠️ The Engine Room (Tech Stack)

### **Frontend**
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion (for buttery-smooth animations)
- **Icons**: Lucide React
- **Data Viz**: Recharts

### **Backend**
- **Environment**: Node.js & Express (TypeScript)
- **Security**: Helmet, CORS, Zod (Schema Validation)
- **Database**: PostgreSQL via Supabase

### **Integrations**
- **AI Core**: Google Generative AI (Gemini Pro)
- **Authentication**: Supabase Auth (JWT based)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Supabase** Project (for Database & Auth)
- **Google AI Studio** API Key (for Gemini)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/ashishjha1304/career-road-ai.git
cd career-road-ai

# Setup Frontend
cd frontend
npm install
# Create .env.local and add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Setup Backend
cd ../backend
npm install
# Create .env and add GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

### 3. Execution

**Run Backend:**
```bash
cd backend && npm run dev
```

**Run Frontend:**
```bash
cd frontend && npm run dev
```

---

## 📂 Architecture Overview

```text
├── frontend/             # Next.js 14 Web Application
│   ├── src/app/          # App Router & Server Actions
│   ├── src/components/   # Atomic UI Design Components
│   ├── src/lib/          # Supabase Client & Logic Utilities
├── backend/              # Node.js API Server
│   ├── src/controllers/  # Request Handlers
│   ├── src/services/     # AI Logic & Roadmap Engine
│   └── src/validators/   # Request Body Validation (Zod)
└── .gitignore            # Clean environment management
```

---

## 🎓 Pro Membership
*Level up your career for a one-time fee of just ₹49 (Manual UPI Verification via `8591852039@fam`).*
- **AI Deep Insights**: Personalized tips per skill.
- **Printable Certificates**: Royal-themed high-res PDF certifications.
- **Lifetime Access**: No recurring costs, just pure growth.

---

## 🤝 Project Owner

**Ashish Jha**
- **Portfolio**: [ashishjha.me](https://ashishjha1304.vercel.app)
- **LinkedIn**: [Ashish Jha](https://www.linkedin.com/in/ashishjha1304/)
- **Project URL**: [careerroad-ai.vercel.app](https://careerroad-ai.vercel.app)

---

Developed with ❤️ and AI by **Ashish Jha**. If this project inspired you, kindly ⭐️ the repo!
