"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Menu, X, Rocket, Target, Zap, CheckCircle2, Moon, Sun, ArrowRight, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">CareerRoad <span className="text-primary italic">AI</span></span>
          </div>

          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-foreground/80">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
            <div className="flex items-center gap-4 border-l border-border pl-8">
              <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border w-9 h-9 flex items-center justify-center mr-2 relative group"
                  aria-label="Toggle Theme"
              >
                  {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
              </button>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
              <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl hover:bg-muted transition-colors w-9 h-9 flex items-center justify-center"
              >
                  {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
              </button>
              <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-background z-[100] flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-2">
                 <Rocket className="h-6 w-6 text-primary" />
                 <span className="text-xl font-bold text-foreground">CareerRoad AI</span>
               </div>
               <button className="p-2 text-foreground bg-muted rounded-xl" onClick={() => setIsMenuOpen(false)}>
                 <X size={28} />
               </button>
            </div>

            <div className="flex flex-col gap-6">
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors flex justify-between items-center border-b border-border/50 pb-4">
                Features <ArrowRight size={20} />
              </Link>
              <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors flex justify-between items-center border-b border-border/50 pb-4">
                How It Works <ArrowRight size={20} />
              </Link>
              <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors flex justify-between items-center border-b border-border/50 pb-4">
                Pricing <ArrowRight size={20} />
              </Link>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-foreground hover:text-primary transition-colors flex justify-between items-center border-b border-border/50 pb-4">
                Contact <ArrowRight size={20} />
              </Link>
            </div>

            <div className="mt-auto pt-10 flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-2xl mb-4 border border-border">
                <span className="text-foreground font-bold">Switch Theme</span>
                <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-3 bg-primary/20 rounded-xl text-primary"
                >
                    {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
                </button>
              </div>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20">Get Started Free</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-40 md:pt-48 md:pb-60">
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
            {/* Animated Mesh blobs - different colors for light/dark */}
            <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-[-10%] left-[15%] w-[45%] h-[45%] bg-purple-600/10 dark:bg-purple-600/10 blur-[110px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
            <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-sky-400/10 dark:bg-sky-400/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Dynamic Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(currentColor 1.5px, transparent 1.5px), linear-gradient(90deg, currentColor 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
            
            {/* Glossy gradient wrap */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>

          <div className="container px-4 mx-auto text-center relative z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-10"
            >
              <Zap className="h-3.5 w-3.5 mr-2 fill-primary/20" />
              Next-Gen AI Roadmapping
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-foreground to-foreground/70 dark:from-white dark:to-white/50 bg-clip-text text-transparent leading-[0.95] md:leading-[0.9]"
            >
              Architect Your <br className="hidden md:block" />
              <span className="text-primary italic">Success Journey.</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
            >
              The industry-standard AI engine for career acceleration. From Data Architecture to Quantum Computing, we engineer your path to excellence.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <Link href="/signup">
                <Button size="lg" className="h-16 px-10 text-md font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group">
                  Elevate Your Career
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-16 px-10 text-md font-bold rounded-2xl border-border/60 hover:bg-muted transition-all backdrop-blur-sm">
                  System Overview
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to grow</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Professional tools designed for students and aspiring developers to track progress efficiently.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 px-4">
              {[
                {
                  title: "AI-Powered Roadmaps",
                  desc: "Generate structured learning paths tailored to your specific career goals in seconds.",
                  icon: <Zap className="h-6 w-6 text-primary" />
                },
                {
                  title: "Progress Tracking",
                  desc: "Mark skills as completed and visualize your journey with intuitive dashboards and charts.",
                  icon: <Target className="h-6 w-6 text-primary" />
                },
                {
                    title: "Curated Tools",
                    desc: "Every roadmap includes a list of recommended industry tools and software to master.",
                    icon: <CheckCircle2 className="h-6 w-6 text-primary" />
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background border border-border p-8 rounded-3xl hover:shadow-lg transition-all hover:border-primary/20">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16 px-4">
                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center text-primary font-bold text-sm tracking-wider uppercase mb-4">
                            Workflow
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">Your career path, <br /> mapped in 3 simple steps.</h2>
                        
                        <div className="space-y-8">
                            {[
                                { step: "01", title: "Choose Your Path", desc: "Select from modern roles like Data Scientist, Web Dev, or AI Engineer." },
                                { step: "02", title: "Generate & Customize", desc: "Get a structured roadmap with Beginner, Intermediate, and Advanced stages." },
                                { step: "03", title: "Track Progress", desc: "Update your skill status daily and watch your analytics dashboard grow." }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="text-3xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">{s.step}</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                                        <p className="text-muted-foreground">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gradient-to-tr from-primary/5 to-primary/20 border border-primary/20 aspect-video rounded-3xl flex items-center justify-center relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                        <Rocket className="h-32 w-32 text-primary floating" />
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-24 px-4">
            <div className="container mx-auto px-4 bg-primary rounded-[3rem] py-16 text-center text-primary-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-primary-foreground mb-6">
                        Limited Time Offer
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Master your career for just <span className="bg-white text-primary px-4 py-1 rounded-2xl">₹49</span></h2>
                    <p className="text-primary-foreground/80 text-xl mb-10 font-medium">Get lifetime access to Pro features: Digital Certificates, AI-Powered Career Insights, and Priority Support from Ashish Jha.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                                Unlock Pro Now
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                                Explore Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" className="py-32 bg-muted/20">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                        <Mail size={12} />
                        Communications
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black mb-4 tracking-tighter">Support & <span className="text-primary">Engagement.</span></h2>
                    <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg">Have strategic inquiries or technical requirements? Connect with our team.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-card border border-border p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden group h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Rocket size={24} />
                                </div>
                                Founder Operations
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Lead Architect</p>
                                    <p className="text-xl sm:text-2xl font-bold tracking-tight">Ashish Jha</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Corporate Correspondence</p>
                                    <a href="mailto:ashishjha1304@outlook.com" className="text-lg sm:text-xl font-bold text-primary hover:underline decoration-primary/30 transition-all break-all">
                                        ashishjha1304@outlook.com
                                    </a>
                                </div>
                                <div className="p-6 sm:p-8 bg-primary/5 border border-primary/10 rounded-2xl sm:rounded-3xl italic text-sm sm:text-md text-muted-foreground leading-relaxed shadow-sm">
                                    &quot;CareerRoad AI was architected to empower individuals during their professional journey. If you encounter any technical impediments or have strategic feedback, please reach out directly.&quot;
                                    <p className="not-italic font-black text-primary mt-6 uppercase tracking-[0.2em] text-[11px]">— Ashish Jha, Founder</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col justify-center items-center text-center group transition-all hover:border-primary/20"
                    >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                            <Mail className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Deployment Support</h3>
                        <p className="text-muted-foreground font-medium mb-10 max-w-sm text-sm sm:text-base">
                            Access our full-scale dedicated support portal for specialized inquiries and account management.
                        </p>
                        <Link href="/contact" className="w-full">
                            <Button className="w-full h-14 sm:h-16 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-primary/20 group">
                                Open Contact Portal
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 px-4 bg-muted/20">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    <span className="font-bold">CareerRoad AI</span>
                </div>
                <div className="flex gap-4 items-center">
                    <a href="https://www.linkedin.com/in/ashishjha1304/" target="_blank" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/10 hover:text-primary transition-all border border-border/50">
                        <Linkedin size={18} />
                    </a>
                    <a href="https://github.com/ashishjha1304" target="_blank" className="p-2 bg-muted/50 rounded-lg hover:bg-primary/10 hover:text-primary transition-all border border-border/50">
                        <Github size={18} />
                    </a>
                </div>
            </div>
            <div className="pt-8 border-t border-border/20 text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/70 mb-2">Developed and Architected by Ashish Jha</p>
                <p className="text-[10px] text-muted-foreground/80">
                    © 2026 CareerRoad AI. Built with <span className="text-primary">Passion</span> for students globally.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
