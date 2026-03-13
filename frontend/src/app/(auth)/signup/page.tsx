"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket, Loader2, Mail, Lock, User, Briefcase, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const CAREER_SUGGESTIONS = [
  'Web Developer', 'Data Analyst', 'UI/UX Designer', 'AI Engineer',
  'Cybersecurity Expert', 'DevOps Engineer', 'Mobile App Developer', 'Product Manager',
];

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const filteredSuggestions = CAREER_SUGGESTIONS.filter(s =>
    careerGoal.length > 0 && s.toLowerCase().includes(careerGoal.toLowerCase()) && s !== careerGoal
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal.trim()) {
      setError('Please enter your career goal.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            career_goal: careerGoal,
          },
        },
      });

      if (signupError) {
        if (signupError.message.toLowerCase().includes('already registered') ||
            signupError.message.toLowerCase().includes('already exists')) {
          setError('An account with this email already exists. Please log in instead.');
          setLoading(false);
          return;
        }
        throw signupError;
      }

      if (user) {
        await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            career_goal: careerGoal,
          }),
        });
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">Account Created!</h2>
          <p className="text-muted-foreground mb-2 text-lg">
            Welcome aboard, <span className="font-bold text-foreground">{fullName.split(' ')[0]}</span>!
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            We've sent a confirmation email to <span className="font-semibold text-foreground">{email}</span>.
            Please verify your email, then log in to start your roadmap.
          </p>
          <Button
            size="lg"
            className="w-full h-12 rounded-2xl font-bold"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background overflow-hidden px-4 md:px-0">
      <div className="flex flex-col justify-center items-center p-4 md:p-12 lg:p-24 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:hidden mb-8">
            <Link href="/" className="flex items-center justify-center gap-2">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">CareerRoad AI</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-medium">
              {error}
              {error.includes('already exists') && (
                <Link href="/login" className="block mt-2 underline font-bold">
                  → Click here to log in
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="pl-10 h-10 rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="careerGoal">
                Target Career Goal{' '}
                <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">(Cannot be changed later)</span>
              </Label>
              <div className="relative group">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                  id="careerGoal"
                  placeholder="e.g. Cybersecurity Expert, Data Analyst..."
                  className="pl-10 h-10 rounded-xl"
                  value={careerGoal}
                  onChange={(e) => {
                    setCareerGoal(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  required
                  autoComplete="off"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        onMouseDown={() => {
                          setCareerGoal(s);
                          setShowSuggestions(false);
                        }}
                      >
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Choose wisely — your AI roadmap will be built specifically for this goal and cannot be updated.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-10 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••• (e.g. Abc12345)"
                  className="pl-10 pr-10 h-10 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { label: '8+ chars', met: password.length >= 8 },
                  { label: 'Upper', met: /[A-Z]/.test(password) },
                  { label: 'Lower', met: /[a-z]/.test(password) },
                  { label: 'Number', met: /[0-9]/.test(password) },
                ].map((req, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      req.met
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    {req.label}
                  </span>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 rounded-xl shadow-lg mt-4 font-bold"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
          </form>
        </motion.div>
      </div>

      <div className="hidden md:flex flex-col justify-center p-12 lg:p-24 bg-primary text-primary-foreground relative overflow-hidden order-1 md:order-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="bg-primary-foreground/20 p-2 rounded-xl">
              <Rocket className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CareerRoad AI</span>
          </Link>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight mb-8"
          >
            Start mapping <br /> your future today.
          </motion.h2>
          <p className="text-xl text-primary-foreground/70 max-w-md leading-relaxed">
            Type any career goal and our AI will build a personalized, step-by-step learning roadmap just for you.
          </p>
          <div className="mt-12 space-y-4">
            {['Free AI-Personalized Roadmaps', 'Analytics & Progress Tracking', 'Any Career Goal Supported'].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/40"></div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
