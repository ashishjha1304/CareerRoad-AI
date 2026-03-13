"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        // Wait a moment for the client to process the URL hash
        setTimeout(async () => {
          const { data: { session: s } } = await supabase.auth.getSession();
          if (s) {
            setSessionReady(true);
          } else {
            setError('Reset link has expired or is invalid. Please request a new password reset.');
          }
        }, 1000);
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">CareerRoad AI</span>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          {success ? (
            <div className="text-center py-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">Password Updated!</h2>
              <p className="text-muted-foreground text-sm">
                Your password has been successfully changed. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight mb-2">Create new password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter a new password for your account. Your profile, roadmap, and data will be fully preserved.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm mb-5">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!sessionReady && !error && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm mb-5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying reset link...
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" title="At least 8 characters, one uppercase, one lowercase, and one number" className="font-bold">New Password</Label>
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
                      disabled={!sessionReady}
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-bold">Confirm New Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className="pl-10 pr-10 h-10 rounded-xl"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={!sessionReady}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl font-bold mt-2"
                  disabled={loading || !sessionReady}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
