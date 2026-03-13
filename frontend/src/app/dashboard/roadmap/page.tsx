"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
import { 
    CheckCircle2,
    Circle,
    ChevronDown,
    ChevronUp,
    Briefcase,
    Zap,
    Info,
    Rocket,
    PenTool,
    Check,
    Layers,
    Lock,
    Trophy,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Certificate } from '@/components/dashboard/certificate';

export default function RoadmapPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [expandedStage, setExpandedStage] = useState<string | null>(null);
    const [skillError, setSkillError] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [activeInsight, setActiveInsight] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRoadmapData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            const token = session.access_token;

            try {
                const [profileRes, roadmapRes] = await Promise.all([
                    fetch(`${API_URL}/api/user/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/api/roadmap`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                let pData = null;
                let rData = null;

                if (profileRes.ok) {
                    const pJson = await profileRes.json();
                    pData = pJson.data;
                    setProfile(pData);
                }
                if (roadmapRes.ok) {
                    const rJson = await roadmapRes.json();
                    rData = rJson.data;
                    setRoadmap(rData);
                }

                setUser(session.user);
                const finalCareerGoal = pData?.career_goal || session.user.user_metadata?.career_goal;

                if (!rData && finalCareerGoal) {
                    return { needGeneration: true, careerPath: finalCareerGoal };
                }
            } catch (err) {
                console.error('Error fetching roadmap data:', err);
            } finally {
                setLoading(false);
            }
            return null;
        };

        fetchRoadmapData().then(res => {
            if (res?.needGeneration) {
                setTimeout(() => {
                    generateRoadmap(res.careerPath);
                }, 100);
            }
        });
    }, [router]);

    const generateRoadmap = async (careerPath: string) => {
        setGenerating(true);
        setGenerateError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch(`${API_URL}/api/roadmap/generate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ careerPath })
            });

            if (response.ok) {
                const detailRes = await fetch(`${API_URL}/api/roadmap`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (detailRes.ok) {
                    const dJson = await detailRes.json();
                    setRoadmap(dJson.data);
                }
            } else {
                const errJson = await response.json().catch(() => ({}));
                console.error('Failed to generate roadmap:', errJson);
                throw new Error(errJson.message || 'Failed to generate roadmap from API.');
            }
        } catch (err: any) {
            console.error('Error generating roadmap:', err);
            setGenerateError(err.message || 'Network error while generating roadmap. Please try again.');
            setTimeout(() => setGenerateError(null), 5000);
        } finally {
            setGenerating(false);
        }
    };

    const updateSkillStatus = async (skillId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        
        const previousRoadmap = JSON.parse(JSON.stringify(roadmap));

        const updatedRoadmap = JSON.parse(JSON.stringify(roadmap));
        updatedRoadmap.stages.forEach((stage: any) => {
            stage.skills.forEach((skill: any) => {
                if (skill.id === skillId) {
                    skill.status = newStatus;
                    if (newStatus === 'completed') {
                        updatedRoadmap.completed_skills = (updatedRoadmap.completed_skills || 0) + 1;
                    } else {
                        updatedRoadmap.completed_skills = Math.max(0, (updatedRoadmap.completed_skills || 1) - 1);
                    }
                }
            });
        });
        setRoadmap(updatedRoadmap);
        setSkillError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`${API_URL}/api/skills/update`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ skillId, status: newStatus })
            });

            if (!res.ok) {
                setRoadmap(previousRoadmap);
                const errJson = await res.json().catch(() => ({}));
                setSkillError(errJson.message || 'Failed to update skill. Changes reverted.');
                setTimeout(() => setSkillError(null), 4000);
            }
        } catch (err) {
            console.error('Error updating skill:', err);
            setRoadmap(previousRoadmap);
            setSkillError('Network error. Skill update reverted.');
            setTimeout(() => setSkillError(null), 4000);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Rocket className="h-10 w-10 text-primary animate-bounce" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                {(skillError || generateError) && (
                    <div className="fixed bottom-6 right-6 z-50 bg-destructive text-destructive-foreground px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2">
                        ⚠️ {skillError || generateError}
                    </div>
                )}
                {!roadmap && !generating && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-12 md:py-24"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-8 ml-auto mr-auto lg:ml-0">
                            <Rocket size={12} />
                            AI Personalization Engine
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-center lg:text-left">
                           Unfold your <br /> <span className="text-primary">destiny.</span>
                        </h2>
                        <p className="text-muted-foreground text-xl mb-12 max-w-xl font-medium tracking-tight text-center lg:text-left">
                            Our AI architect will curate a professional trajectory specifically designed for your current aspirations.
                        </p>
                        
                        <div className="mb-10 p-6 rounded-[2rem] bg-card border border-border flex flex-col md:flex-row gap-4 items-end relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 right-1/4 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />
                            <div className="flex-1 w-full relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Create A Custom Reality</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cybersecurity Expert, Quantum Physicist..." 
                                    className="w-full h-14 bg-background border border-border rounded-2xl px-5 font-medium shadow-inner focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                                    id="custom-career-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = (e.target as HTMLInputElement).value;
                                            if (val.trim()) generateRoadmap(val);
                                        }
                                    }}
                                />
                            </div>
                            <Button 
                                className="w-full md:w-auto h-14 px-8 rounded-2xl font-bold relative z-10 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-all text-sm uppercase tracking-wider"
                                onClick={() => {
                                    const val = (document.getElementById('custom-career-input') as HTMLInputElement).value;
                                    if (val.trim()) generateRoadmap(val);
                                }}
                            >
                                <Zap className="h-5 w-5 mr-3" />
                                Synthesize Path
                            </Button>
                        </div>
                        
                        <div className="text-center mb-8 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] relative">
                            <span className="bg-background px-4 relative z-10">OR SELECT A CORE DISCIPLINE</span>
                            <div className="absolute top-1/2 left-0 w-full h-px bg-border/50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Web Developer", icon: <PenTool className="h-6 w-6" />, color: "bg-blue-500" },
                                { name: "Data Analyst", icon: <Briefcase className="h-6 w-6" />, color: "bg-emerald-500" },
                                { name: "UI/UX Designer", icon: <Zap className="h-6 w-6" />, color: "bg-purple-500" },
                                { name: "AI Engineer", icon: <Rocket className="h-6 w-6" />, color: "bg-orange-500" }
                            ].map((career, i) => (
                                <motion.div key={i} whileHover={{ y: -5 }}>
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-32 flex flex-col items-center justify-center gap-3 rounded-3xl hover:border-primary/50 hover:bg-primary/5 border-2 border-border/40 shadow-sm relative overflow-hidden group"
                                        onClick={() => generateRoadmap(career.name)}
                                    >
                                        <div className={`absolute top-0 right-0 w-16 h-16 ${career.color} blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity`} />
                                        <div className={`p-3 rounded-2xl ${career.color}/10 text-${career.color.split('-')[1]}-500 group-hover:scale-110 transition-transform`}>
                                            {career.icon}
                                        </div>
                                        <span className="font-extrabold text-sm uppercase tracking-wider">{career.name}</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {generating && (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                         <div className="relative mb-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-t-4 border-r-4 border-primary/20"
                            />
                            <Rocket className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 floating" />
                         </div>
                         <h2 className="text-3xl font-black tracking-tight mb-2">Architecting your path...</h2>
                         <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Analyzing career requirements</p>
                    </div>
                )}

                {roadmap && (
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                            <div className="flex-1">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 mb-4"
                                >
                                    <div className="bg-primary/20 p-2.5 rounded-2xl border border-primary/20">
                                        <Layers className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Mastery Blueprint</span>
                                </motion.div>
                                <h1 className="text-5xl font-black tracking-tighter mb-4">{roadmap.title}</h1>
                                <p className="text-muted-foreground text-xl font-medium tracking-tight max-w-2xl">
                                    Strategic sequence of <span className="text-foreground">{roadmap.total_skills} modular skills</span> designed for maximum professional leverage.
                                </p>
                            </div>
                                                        <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between items-baseline mb-1 px-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Global Progress</span>
                                    <span className="text-2xl font-black text-primary">{Math.round((roadmap.completed_skills / roadmap.total_skills) * 100) || 0}%</span>
                                </div>
                                <div className="h-3 rounded-full bg-muted/40 border border-border/30 overflow-hidden shadow-inner p-0.5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(roadmap.completed_skills / roadmap.total_skills) * 100 || 0}%` }}
                                        className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {roadmap.completed_skills === roadmap.total_skills && roadmap.total_skills > 0 && (
                            <div className="py-12 border-y border-border/50">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mb-12"
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">
                                        <Trophy size={12} />
                                        Milestone Reached
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight mb-4">You&apos;ve Mastered It!</h2>
                                    <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                                        Congratulations! You have completed all modules in your {roadmap.title} journey. Here is your official certification.
                                    </p>
                                </motion.div>
                                <Certificate 
                                    userName={profile?.full_name || user?.user_metadata?.full_name || 'Alumni'}
                                    courseName={roadmap.title}
                                    date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    isPro={profile?.subscription_status === 'pro'}
                                />
                            </div>
                        )}

                        <div className="space-y-6">
                            {[...roadmap.stages].sort((a: any, b: any) => a.level - b.level).map((stage: any, i: number, sortedArr: any[]) => {
                                const stageProgress = Math.round((stage.skills?.filter((s:any)=>s.status==='completed').length / stage.skills?.length) * 100) || 0;
                                const isUnlocked = i === 0 || (sortedArr[i-1].skills.every((s:any) => s.status === 'completed'));

                                return (
                                    <motion.div 
                                      key={i}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className={`border border-border/50 shadow-2xl bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:border-primary/20 ${!isUnlocked ? 'opacity-60 saturate-0' : ''}`}>
                                            <div 
                                                className="p-10 cursor-pointer flex items-center justify-between"
                                                onClick={() => isUnlocked && setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                                            >
                                                <div className="flex items-center gap-8">
                                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black border transition-all duration-300 ${expandedStage === stage.id ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' : 'bg-muted/50 border-border group-hover:border-primary/40 group-hover:text-primary'}`}>
                                                        {i + 1 < 10 ? `0${i+1}` : i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{stage.name}</h3>
                                                            {stageProgress === 100 && <div className="bg-emerald-500/10 p-1 rounded-full"><Check className="text-emerald-500" size={12} strokeWidth={4} /></div>}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                            <span>{stage.skills?.length || 0} MODULES</span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                                            <span className={stageProgress === 100 ? 'text-emerald-500' : 'text-primary'}>{stageProgress}% ACHIEVED</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    {!isUnlocked ? (
                                                        <div className="p-3 bg-muted/40 rounded-2xl border border-border">
                                                            <Lock size={18} className="text-muted-foreground" />
                                                        </div>
                                                    ) : (
                                                        <div className={`p-3 rounded-2xl transition-all ${expandedStage === stage.id ? 'bg-primary/20 rotate-180' : 'bg-muted/40 group-hover:bg-primary/10'}`}>
                                                            <ChevronDown className={expandedStage === stage.id ? 'text-primary' : 'text-muted-foreground'} size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedStage === stage.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: "circOut" }}
                                                    >
                                                        <div className="px-10 pb-12 space-y-4 pt-4 border-t border-border/20">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                                                {stage.skills?.map((skill: any, j: number) => (
                                                                    <div 
                                                                        key={j} 
                                                                        className={`p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group/item ${
                                                                            skill.status === 'completed' 
                                                                            ? 'bg-emerald-500/5 border-emerald-500/10' 
                                                                            : 'bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-primary/20 hover:translate-y-[-2px]'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-start gap-4 relative z-10">
                                                                            <button 
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateSkillStatus(skill.id, skill.status);
                                                                                }}
                                                                                className={`mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                                    skill.status === 'completed' 
                                                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                                                                    : 'border-muted-foreground/30 hover:border-primary text-transparent'
                                                                                }`}
                                                                            >
                                                                                <Check size={16} strokeWidth={4} className={skill.status === 'completed' ? 'opacity-100' : 'opacity-0'} />
                                                                            </button>
                                                                            <div className="flex-1">
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <h4 className={`text-lg font-black tracking-tight transition-all ${skill.status === 'completed' ? 'text-muted-foreground' : ''}`}>
                                                                                        {skill.name}
                                                                                    </h4>
                                                                                </div>
                                                                                <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 opacity-80">{skill.description}</p>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {skill.tools?.map((tool: string, k: number) => (
                                                                                        <span key={k} className="text-[9px] font-black uppercase tracking-widest bg-muted/50 border border-border/40 px-2.5 py-1 rounded-lg shadow-sm">
                                                                                            {tool}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                                
                                                                                <div className="mt-6 pt-4 border-t border-border/40">
                                                                                    {profile?.subscription_status === 'pro' && activeInsight === skill.id ? (
                                                                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl relative overflow-hidden">
                                                                                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full" />
                                                                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">
                                                                                                <Sparkles size={12} className="animate-pulse" />
                                                                                                AI Career Insight
                                                                                            </span>
                                                                                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic relative z-10">
                                                                                                &quot;Focusing on <strong className="text-emerald-500">{skill.name}</strong> provides a massive leverage point for your journey as a {roadmap.career_path}. Interviewers specifically look for practical experience with {skill.tools?.[0] || 'core technologies'}.&quot;
                                                                                            </p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <Button 
                                                                                            variant="ghost" 
                                                                                            size="sm" 
                                                                                            className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-fit ${profile?.subscription_status === 'pro' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20'}`}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (profile?.subscription_status === 'pro') {
                                                                                                    setActiveInsight(activeInsight === skill.id ? null : skill.id);
                                                                                                } else {
                                                                                                    window.dispatchEvent(new Event('open-upi-modal'));
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Sparkles size={12} className="mr-1.5" />
                                                                                            {profile?.subscription_status === 'pro' ? 'Generate AI Insight' : 'Unlock Pro Insights'}
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {skill.status === 'completed' && (
                                                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                                                <Trophy size={48} className="rotate-12" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

