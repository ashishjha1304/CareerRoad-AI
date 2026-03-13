"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
    Save,
    AlertCircle,
    UserCircle,
    Mail,
    Globe,
    CheckCircle2,
    User,
    Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [form, setForm] = useState({ fullName: '', careerGoal: '' });
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            const userMetadata = user.user_metadata;

            try {
                const session = await supabase.auth.getSession();
                const token = session.data.session?.access_token;

                const profileRes = await fetch(`${API_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (profileRes.ok) {
                    const json = await profileRes.json();
                    const profileData = json.data;
                    setProfile(profileData);
                    
                    // Priority: Backend Profile > Auth Metadata > Default
                    const finalName = profileData?.full_name || userMetadata?.full_name || '';
                    const finalGoal = profileData?.career_goal || userMetadata?.career_goal || '';
                    
                    setForm({ 
                        fullName: finalName, 
                        careerGoal: finalGoal || 'Global Professional'
                    });
                } else {
                    setForm({
                        fullName: userMetadata?.full_name || '',
                        careerGoal: userMetadata?.career_goal || 'Global Professional'
                    });
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);
        setSaveError(null);
        
        try {
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;

            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: form.fullName
                })
            });

            if (response.ok) {
                const json = await response.json();
                setProfile(json.data);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                const errJson = await response.json();
                setSaveError(errJson.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setSaveError('An unexpected error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async () => {
        if (!user?.email) return;
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (error) throw error;
            setResetSent(true);
        } catch (err: any) {
            alert(`Failed to send reset email: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-black tracking-tight mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Configure your career identity</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-lg bg-card rounded-3xl overflow-hidden">
                            <div className="h-24 bg-gradient-to-tr from-primary to-indigo-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full"></div>
                            </div>
                            <div className="px-6 pb-8 -mt-12 relative z-10 text-center">
                                <div className="inline-block p-1 bg-card rounded-full mb-4 shadow-xl">
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-card">
                                        <User size={48} className="text-muted-foreground/60" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold">{profile?.full_name || user?.user_metadata?.full_name || 'New Member'}</h2>
                                <p className="text-muted-foreground text-sm font-medium mb-4">{user?.email}</p>
                                <div className={`px-3 py-1.5 rounded-xl border inline-block ${profile?.subscription_status === 'pro' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-primary/10 border-primary/20'}`}>
                                    <span className={`text-xs font-black uppercase tracking-wider ${profile?.subscription_status === 'pro' ? 'text-emerald-500' : 'text-primary'}`}>
                                        {profile?.subscription_status === 'pro' ? '⚡ Pro Member' : 'Free Member'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-lg bg-card rounded-3xl p-6">
                            <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                                <AlertCircle size={18} className="text-primary" />
                                Account Security
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3">
                                    <span className="text-muted-foreground">Email Verified</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full">YES</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-3">
                                    <span className="text-muted-foreground">Password Set</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full">YES</span>
                                </div>
                                {resetSent ? (
                                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                        <CheckCircle2 size={14} />
                                        Reset link sent to your email!
                                    </div>
                                ) : (
                                    <Button 
                                        variant="ghost" 
                                        className="w-full text-xs font-bold h-9 mt-2 border border-dashed text-primary hover:bg-primary/5"
                                        onClick={handleResetPassword}
                                    >
                                        Reset Password
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>

                    <Card className="lg:col-span-2 border-none shadow-lg bg-card rounded-3xl">
                        <CardHeader className="p-8 border-b border-border/30">
                            <CardTitle className="text-2xl font-black">Personal Information</CardTitle>
                            <CardDescription className="text-md">These details will be used to personalize your learning roadmap.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="font-black text-xs uppercase tracking-widest text-muted-foreground">Display Name</Label>
                                        <div className="relative">
                                            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="fullName" 
                                                className="pl-10 h-10 rounded-xl"
                                                value={form.fullName}
                                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="careerGoal" className="font-black text-xs uppercase tracking-widest text-muted-foreground">Career Target</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="careerGoal"
                                                className="pl-10 h-10 rounded-xl bg-muted/50 opacity-60"
                                                value={form.careerGoal}
                                                disabled
                                                placeholder="e.g. Space Architect"
                                            />
                                        </div>
                                        <p className="text-[10px] italic text-muted-foreground font-medium">Career target is permanent once set during signup.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input disabled value={user?.email || ''} className="pl-10 h-10 rounded-xl bg-muted/50 opacity-60" />
                                    </div>
                                    <p className="text-[10px] italic text-muted-foreground font-medium">To change your primary email, please contact support.</p>
                                </div>

                                {saveSuccess && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-500 font-semibold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                        <CheckCircle2 size={16} />
                                        Profile updated successfully!
                                    </div>
                                )}
                                {saveError && (
                                    <div className="flex items-center gap-2 text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                                        <AlertCircle size={16} />
                                        {saveError}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button type="submit" size="lg" className="rounded-2xl font-black h-12 shadow-xl hover:scale-105 transition-all text-sm w-full md:w-auto px-10" disabled={saving}>
                                        {saving 
                                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                            : <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                                        }
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
