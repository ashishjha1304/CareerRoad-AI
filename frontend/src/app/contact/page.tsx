"use client";

import { Button } from "@/components/ui/button";
import { Mail, Send, Linkedin, Github, Rocket, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function ContactPage() {
    const [user, setUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "");
        formData.append("subject", `New Message from ${formData.get("name")} on CareerRoad AI`);
        formData.append("from_name", "CareerRoad Support Bot");
        
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert('Bhai, kuch error aaya. Please try again!');
            }
        } catch (error) {
            alert('Service unreachable. Direct mail kar do bhai!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto h-16 px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold tracking-tight">CareerRoad <span className="text-primary italic">AI</span></span>
                    </Link>
                    <Link href={user ? "/dashboard" : "/"}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft size={16} />
                            {user ? "Back to Dashboard" : "Back to Home"}
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto py-12 px-4 md:py-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                        <Mail size={12} />
                        Get In Touch
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        Support & <span className="text-primary">Contact.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">
                        Have questions or need help? I'm Ashish, the developer behind CareerRoad AI. Reach out anytime!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Rocket size={20} />
                                </div>
                                Developer Info
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Lead Developer</p>
                                    <p className="text-xl font-bold italic">Ashish Jha</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Email</p>
                                    <a href="mailto:ashishjha1304@outlook.com" className="text-lg font-medium text-primary hover:underline">
                                        ashishjha1304@outlook.com
                                    </a>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <a href="https://www.linkedin.com/in/ashishjha1304/" target="_blank" className="p-3 bg-muted rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href="https://github.com/ashishjha1304" target="_blank" className="p-3 bg-muted rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                        <Github size={20} />
                                    </a>
                                </div>
                                <div className="mt-8 pt-8 border-t border-border/40 flex flex-wrap gap-x-6 gap-y-2">
                                    <Link href="/terms" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest underline decoration-primary/20 hover:decoration-primary transition-all">Terms of Service</Link>
                                    <Link href="/privacy" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest underline decoration-primary/20 hover:decoration-primary transition-all">Privacy Policy</Link>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] italic text-sm text-muted-foreground leading-relaxed">
                            &quot;CareerRoad AI was architected to empower individuals during their professional journey. If you encounter any technical impediments or have strategic feedback, please reach out directly.&quot;
                            <p className="not-italic font-black text-primary mt-4 uppercase tracking-widest">— Ashish Jha, Founder</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
                    >
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-12"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                                    <Check className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Message Delivered</h3>
                                <p className="text-muted-foreground font-medium mb-8 max-w-xs uppercase text-[10px] tracking-widest leading-relaxed">
                                    Thank you for reaching out. Your inquiry has been forwarded to our technical team. 
                                    We typically respond within 12-24 business hours.
                                </p>
                                <Button 
                                    onClick={() => setIsSuccess(false)}
                                    variant="outline"
                                    className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Return to Contact
                                </Button>
                            </motion.div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <input type="hidden" name="from_name" value="CareerRoad AI Support Inquiry" />
                                <input type="hidden" name="replyto" value="ashishjha1304@outlook.com" />
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input 
                                        name="name"
                                        type="text" 
                                        placeholder="E.g. John Doe" 
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input 
                                        name="email"
                                        type="email" 
                                        placeholder="name@email.com" 
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message Detail</label>
                                    <textarea 
                                        name="message"
                                        placeholder="How can our team help you today?" 
                                        rows={4}
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none font-medium text-sm leading-relaxed"
                                        required
                                    />
                                </div>
                                <Button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 relative overflow-hidden group"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
