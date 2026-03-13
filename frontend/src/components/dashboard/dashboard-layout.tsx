"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Map, 
    User, 
    Settings, 
    LogOut, 
    Rocket,
    Menu,
    X,
    Bell,
    ChevronRight,
    Search,
    Command as CommandIcon,
    Moon,
    Sun,
    Copy,
    Smartphone,
    Check,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useTheme } from 'next-themes';

const UPI_ID = '8591852039@fam';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => (
    <Link href={href}>
        <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
            }`}
        >
            <div className={`transition-colors ${active ? 'text-primary' : 'group-hover:text-foreground'}`}>
                {icon}
            </div>
            {label}
            {active && (
                <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto"
                >
                    <ChevronRight size={14} />
                </motion.div>
            )}
        </motion.div>
    </Link>
);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [roadmap, setRoadmap] = useState<any>(null);

    useEffect(() => {
        const handleOpenModal = () => setShowUpiModal(true);
        window.addEventListener('open-upi-modal', handleOpenModal);
        return () => window.removeEventListener('open-upi-modal', handleOpenModal);
    }, []);

    const handleCopyUpi = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        setMounted(true);
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const publicPaths = ['/contact', '/terms', '/privacy'];
            
            if (!user && !publicPaths.includes(pathname)) {
                router.push('/login');
                return;
            }
            if (user) {
                setUser(user);

                const { data: profileData } = await supabase.from('profiles').select('subscription_status, full_name').eq('id', user.id).single();
                if (profileData) setProfile(profileData);

                const { data: { session } } = await supabase.auth.getSession();
                const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
                const roadmapRes = await fetch(`${API_URL}/api/roadmap`, {
                    headers: { 'Authorization': `Bearer ${session?.access_token}` }
                });
                if (roadmapRes.ok) {
                    const rJson = await roadmapRes.json();
                    setRoadmap(rJson.data);
                    generateNotifications(rJson.data, profileData);
                }
            }
        };
        getUser();
    }, [router]);

    const generateNotifications = (roadmapData: any, profileData: any) => {
        if (!roadmapData) return;

        const currentStage = roadmapData.stages.find((s: any) => 
            s.skills.some((sk: any) => sk.status !== 'completed')
        );

        if (currentStage) {
            const thoughts = [
                "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                "Your future is created by what you do today, not tomorrow.",
                "Don't stop when you're tired. Stop when you're done.",
                "The only way to do great work is to love what you do.",
                "Small progress is still progress. Keep moving forward!"
            ];
            const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];

            setNotifications([
                {
                    id: 1,
                    title: "Continue Your Journey",
                    message: `You're currently in "${currentStage.name}". Don't stop now!`,
                    thought: randomThought,
                    type: "progress",
                    time: "Just now"
                }
            ]);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const items = [
            { title: "Overview Dashboard", href: "/dashboard", category: "Page" },
            { title: "Your Roadmap", href: "/dashboard/roadmap", category: "Page" },
            { title: "Your Profile", href: "/dashboard/profile", category: "Page" },
            { title: "Terms of Service", href: "/terms", category: "Legal" },
            { title: "Privacy Policy", href: "/privacy", category: "Legal" },
            { title: "Contact Ashish (Support)", href: "/contact", category: "Support" },
        ];

        if (roadmap) {
            roadmap.stages.forEach((stage: any) => {
                items.push({ title: `Stage: ${stage.name}`, href: "/dashboard/roadmap", category: "Roadmap Stage" });
                stage.skills.forEach((skill: any) => {
                    items.push({ title: `Skill: ${skill.name}`, href: "/dashboard/roadmap", category: "Skill" });
                });
            });
        }

        const filtered = items.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        setSearchResults(filtered);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const sidebarItems = [
        { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/dashboard" },
        { icon: <Map size={18} />, label: "Roadmap", href: "/dashboard/roadmap" },
        { icon: <User size={18} />, label: "Profile", href: "/dashboard/profile" },
        { icon: <Mail size={18} />, label: "Help & Support", href: "/contact" },
    ];

    return (
        <>
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            <div className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0 opacity-40" />
            <div className="fixed bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0 opacity-30" />

            <aside className="hidden lg:flex flex-col w-64 border-r border-border/60 bg-card/30 backdrop-blur-md fixed h-full z-40 transition-all duration-300">
                <div className="p-6 flex items-center gap-2.5">
                    <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
                        <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">CareerRoad <span className="text-primary italic">AI</span></span>
                </div>

                <div className="px-6 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Architected by Ashish Jha</p>
                </div>

                <div className="px-4 py-2 relative">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            placeholder="Quick search..." 
                            value={searchQuery}
                            onChange={(e) => {
                                handleSearch(e.target.value);
                                setShowSearch(true);
                            }}
                            onFocus={() => setShowSearch(true)}
                            className="w-full bg-muted/30 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                    </div>
                    
                    <AnimatePresence>
                        {showSearch && searchResults.length > 0 && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-4 right-4 top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-2 space-y-1">
                                        {searchResults.map((result, i) => (
                                            <Link 
                                                key={i} 
                                                href={result.href}
                                                onClick={() => {
                                                    setShowSearch(false);
                                                    setSearchQuery('');
                                                }}
                                                className="flex flex-col p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                                            >
                                                <span className="text-xs font-bold">{result.title}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{result.category}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-3 mt-6 space-y-1">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Main Navigation</p>
                    {sidebarItems.map((item, i) => (
                        <SidebarItem 
                            key={i}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            active={pathname === item.href}
                        />
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-border/50">
                    {profile?.subscription_status === 'pro' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-4 flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                <Check className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-emerald-500 uppercase mb-1">PRO ACTIVE</p>
                            <p className="text-[10px] text-muted-foreground font-medium text-center">Unlimited AI Unlocked</p>
                        </div>
                    ) : (
                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl mb-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <Rocket className="h-6 w-6 text-primary mb-2 opacity-80" />
                                <p className="text-[10px] font-black tracking-widest text-primary uppercase mb-1">PRO PLAN</p>
                                <p className="text-[11px] text-muted-foreground mb-3 font-medium">Unlock Unlimited AI Analysis</p>
                                <Button size="sm" className="w-full h-8 text-[11px] font-bold rounded-lg shadow-lg shadow-primary/20" onClick={() => window.dispatchEvent(new Event('open-upi-modal'))}>Upgrade Now</Button>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors w-full rounded-lg hover:bg-destructive/5"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="lg:hidden fixed top-0 w-full h-16 border-b border-border/60 bg-background/80 backdrop-blur-md z-40 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    <span className="font-bold tracking-tight">CareerRoad AI</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-xl bg-muted/50 border border-border"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6 pt-24"
                    >
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-muted/50 border border-border"
                        >
                            <X size={20} />
                        </button>
                        <nav className="space-y-4">
                            {sidebarItems.map((item, i) => (
                                <Link 
                                    key={i} 
                                    href={item.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 text-xl font-bold p-4 rounded-2xl ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-4 text-xl font-bold p-4 text-destructive"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col lg:pl-64 pt-16 lg:pt-0 relative z-10 w-full">
                <header className="hidden lg:flex h-16 border-b border-border/40 px-10 items-center justify-between sticky top-0 bg-background/50 backdrop-blur-lg z-30">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">CareerRoad AI</Link>
                        <ChevronRight size={12} className="opacity-40" />
                        <span className="text-foreground capitalize">{pathname.split('/').pop()}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border w-9 h-9 flex items-center justify-center"
                        >
                            {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
                        </button>
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-xl transition-colors relative group border ${showNotifications ? 'bg-muted border-border' : 'hover:bg-muted border-transparent hover:border-border'}`}
                            >
                                <Bell size={18} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background group-hover:scale-125 transition-transform" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, x: 20 }}
                                            animate={{ opacity: 1, y: 0, x: 0 }}
                                            exit={{ opacity: 0, y: 10, x: 20 }}
                                            className="absolute right-0 top-full mt-4 w-80 bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-border/50 bg-muted/20">
                                                <h3 className="text-sm font-black uppercase tracking-widest">Notifications</h3>
                                            </div>
                                            <div className="p-2 max-h-[400px] overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n) => (
                                                        <div key={n.id} className="p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 mb-1">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                                                    <Rocket size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black tracking-tight">{n.title}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                                                                    {n.thought && (
                                                                        <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 italic text-[10px] text-primary/80 leading-relaxed">
                                                                            &quot;{n.thought}&quot;
                                                                        </div>
                                                                    )}
                                                                    <p className="text-[10px] text-muted-foreground/60 mt-2 font-bold uppercase">{n.time}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center">
                                                        <p className="text-xs font-bold text-muted-foreground italic">No new notifications</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="h-6 w-px bg-border/50 mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            {user ? (
                                <>
                                    <div className="text-right hidden xl:block">
                                        <p className="text-[11px] font-bold leading-none line-clamp-1 max-w-[120px]">
                                            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                                        </p>
                                        <p className={`text-[10px] font-bold mt-1 tracking-wider uppercase ${profile?.subscription_status === 'pro' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                            {profile?.subscription_status === 'pro' ? 'PRO ACCOUNT' : 'Personal Account'}
                                        </p>
                                    </div>
                                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border ${
                                        profile?.subscription_status === 'pro'
                                        ? 'bg-gradient-to-tr from-emerald-500/40 to-teal-500/40 border-emerald-500/40 text-emerald-500'
                                        : 'bg-gradient-to-tr from-primary/40 to-indigo-500/40 border-primary/20'
                                    }`}>
                                        {(profile?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                </>
                            ) : (
                                <Link href="/login">
                                    <Button size="sm" variant="outline" className="h-8 text-[11px] font-bold rounded-lg px-4">Log in</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>

        <AnimatePresence>
            {showUpiModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                    onClick={() => setShowUpiModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="bg-card border border-border rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowUpiModal(false)}
                            className="absolute top-5 right-5 p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/15 p-3 rounded-2xl border border-primary/20">
                                <Smartphone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight uppercase">Premium Upgrade</h3>
                                <p className="text-xs text-muted-foreground font-medium">One-time payment for Lifetime Pro Access — ₹49</p>
                            </div>
                        </div>

                        <div className="bg-muted/40 border border-border rounded-2xl p-5 mb-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Merchant UPI ID</p>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-2xl font-black tracking-tight text-foreground">{UPI_ID}</span>
                                <button
                                    onClick={handleCopyUpi}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                                        copied 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                        : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                                    }`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Activation Steps</p>
                            {[
                                'Complete the payment of ₹49 using any UPI app.',
                                `Email the transaction screenshot to: ashishjha1304@outlook.com`,
                                'Your Pro Account will be activated within 2-4 business hours.',
                            ].map((step, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-[11px] font-black text-primary flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm font-semibold text-muted-foreground/80 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-center text-[11px] text-muted-foreground font-bold leading-relaxed">
                                Need help? Contact us at <span className="text-primary underline">ashishjha1304@outlook.com</span>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
