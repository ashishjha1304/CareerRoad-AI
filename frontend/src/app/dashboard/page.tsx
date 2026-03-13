"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
    CheckCircle2,
    Clock,
    Target,
    Trophy,
    TrendingUp,
    Zap,
    ChevronRight,
    ArrowUpRight,
    Layers,
    Activity,
    Copy,
    X,
    Smartphone,
    Check,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const chartData: Record<string, { name: string; progress: number; target: number }[]> = {
  Daily: [
    { name: '6am', progress: 2, target: 5 },
    { name: '9am', progress: 8, target: 10 },
    { name: '12pm', progress: 15, target: 15 },
    { name: '3pm', progress: 28, target: 20 },
    { name: '6pm', progress: 42, target: 25 },
    { name: '9pm', progress: 58, target: 30 },
  ],
  Weekly: [
    { name: 'Mon', progress: 5, target: 10 },
    { name: 'Tue', progress: 12, target: 15 },
    { name: 'Wed', progress: 25, target: 20 },
    { name: 'Thu', progress: 40, target: 25 },
    { name: 'Fri', progress: 55, target: 30 },
    { name: 'Sat', progress: 72, target: 35 },
    { name: 'Sun', progress: 85, target: 40 },
  ],
  Monthly: [
    { name: 'Wk 1', progress: 10, target: 20 },
    { name: 'Wk 2', progress: 30, target: 40 },
    { name: 'Wk 3', progress: 58, target: 60 },
    { name: 'Wk 4', progress: 85, target: 80 },
  ],
};

const StatCard = ({ title, value, icon, change, color }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="premium-card rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2.5 rounded-2xl bg-muted/50 border border-border/50 group-hover:border-primary/20 transition-colors">
        {icon}
      </div>
      {change && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {change}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
      </div>
    </div>
  </motion.div>
);

const UPI_ID = '8591852039@fam';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chartTab, setChartTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);
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

                if (profileRes.ok) {
                    const pJson = await profileRes.json();
                    setProfile(pJson.data);
                }
                if (roadmapRes.ok) {
                    const rJson = await roadmapRes.json();
                    setRoadmap(rJson.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-primary/20 p-4 rounded-3xl border border-primary/20"
                    >
                        <Zap className="h-8 w-8 text-primary" />
                    </motion.div>
                </div>
            </DashboardLayout>
        );
    }

    const currentStage = roadmap?.stages?.find((s: any) => s.skills.some((sk: any) => sk.status === 'pending'));
    const pendingSkills = currentStage?.skills?.filter((s: any) => s.status === 'pending') || [];
    const completedSkillsCount = roadmap?.completed_skills || 0;
    const totalSkillsCount = roadmap?.total_skills || 1;
    const progressPercent = Math.round((completedSkillsCount / totalSkillsCount) * 100);

    const generateAnalysisData = (segments: number) => {
        return Array.from({ length: segments }).map((_, i) => {
            const baseProgress = Math.min(progressPercent, (i + 1) * (100 / segments));
            return {
                name: segments === 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Wk ${i+1}`,
                progress: Math.max(0, Math.min(100, Math.round(baseProgress))),
                target: Math.round((i + 1) * (100 / segments))
            };
        });
    };

    const dynamicChartData = {
        Daily: generateAnalysisData(6).map((d, i) => ({ ...d, name: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'][i] })),
        Weekly: generateAnalysisData(7),
        Monthly: generateAnalysisData(4)
    };

    return (
        <DashboardLayout>
            <div className="mb-10 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-4"
                >
                  <Activity size={12} />
                  Live Performance Analytics
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-foreground">
                    Level Up, {(profile?.full_name || user?.user_metadata?.full_name || 'User').split(' ')[0]} <span className="text-primary opacity-40">/</span>
                </h1>
                <p className="text-muted-foreground text-lg italic tracking-tight font-medium">Your path to mastering <span className="text-foreground decoration-primary/30 underline underline-offset-4 font-bold">{profile?.career_goal || user?.user_metadata?.career_goal || 'Excellence'}</span> is accelerating.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Mastery Index" 
                    value={`${progressPercent}%`} 
                    icon={<TrendingUp className="text-emerald-500" size={20} />} 
                    change="+12.5%" 
                    color="bg-emerald-500" 
                />
                <StatCard 
                    title="Skill Milestones" 
                    value={`${completedSkillsCount}/${totalSkillsCount}`} 
                    icon={<CheckCircle2 className="text-blue-500" size={20} />} 
                    change="2 NEW" 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Active Phase" 
                    value={currentStage?.name || "Ready"} 
                    icon={<Layers className="text-orange-500" size={20} />} 
                    color="bg-orange-500" 
                />
                <StatCard 
                    title="Learning Velocity" 
                    value="4.2h" 
                    icon={<Clock className="text-purple-500" size={20} />} 
                    change="HIGH" 
                    color="bg-purple-500" 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <Card className="xl:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-border/40 group">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <CardTitle className="text-3xl font-black tracking-tight mb-2">Growth Trajectory</CardTitle>
                                <CardDescription className="text-md font-medium">Real-time skill acquisition visualization for this week.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-2xl border border-border/50">
                                {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => (
                                    <button 
                                      key={tab}
                                      onClick={() => setChartTab(tab)}
                                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${tab === chartTab ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 h-[400px] relative">
                         <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]" />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicChartData[chartTab]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                                <XAxis 
                                  dataKey="name" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: '700'}} 
                                  dy={15} 
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'hsl(var(--card))', 
                                      borderRadius: '16px', 
                                      border: '1px solid hsl(var(--border))', 
                                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                      padding: '12px'
                                    }}
                                    itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="progress" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={5} 
                                  fillOpacity={1} 
                                  fill="url(#colorProgress)" 
                                  animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-xl bg-card rounded-[2.5rem] p-8 border border-border/40">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
                                <Target className="h-6 w-6 text-primary" />
                                Current Focus
                            </h3>
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {pendingSkills.slice(0, 3).map((skill: any, i: number) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="group"
                                >
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{skill.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">NEXT</span>
                                    </div>
                                    <Progress value={0} className="h-2 rounded-full bg-muted/30" />
                                </motion.div>
                            ))}
                            
                            {pendingSkills.length === 0 && (
                                <div className={`text-center py-10 rounded-2xl border border-dashed ${progressPercent === 100 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted/20 border-border/50'}`}>
                                    <Trophy className={`h-12 w-12 mx-auto mb-3 ${progressPercent === 100 ? 'text-yellow-500' : 'text-primary/40'}`} />
                                    <p className={`text-xs font-bold ${progressPercent === 100 ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                                        {progressPercent === 100 
                                            ? "Legendary! You have mastered your career roadmap." 
                                            : "Complete tasks to unlock your next focus."}
                                    </p>
                                </div>
                            )}

                            <Button 
                              variant={progressPercent === 100 ? "default" : "ghost"} 
                              className={`w-full mt-6 h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${
                                progressPercent === 100 
                                ? 'bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] border-none' 
                                : 'bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20'
                              }`}
                              onClick={() => router.push('/dashboard/roadmap')}
                            >
                                {progressPercent === 100 
                                    ? (profile?.subscription_status === 'pro' ? "Download Certificate" : "Upgrade for Certificate")
                                    : "Open Full Roadmap"
                                }
                                <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                            </Button>
                        </div>
                    </Card>

                    {profile?.subscription_status !== 'pro' && (
                        <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-indigo-700 text-primary-foreground rounded-[2.5rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Unlock Pro Perks</h3>
                                <p className="text-sm text-primary-foreground/80 mb-6 font-medium">Get personalized AI feedback on every skill you complete.</p>
                                <Button 
                                    variant="secondary" 
                                    className="w-full h-12 rounded-2xl font-black text-sm shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform"
                                    onClick={() => window.dispatchEvent(new Event('open-upi-modal'))}
                                >
                                    Upgrade Today
                                    <ArrowUpRight className="ml-2" size={18} />
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
