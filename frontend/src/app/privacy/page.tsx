"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Simple Top Nav */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto h-16 px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold tracking-tight">CareerRoad <span className="text-primary italic">AI</span></span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto py-12 px-4 md:py-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">
                        <ShieldCheck size={12} />
                        Privacy Policy
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        Privacy <span className="text-emerald-500">Policy.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        Your data security is Ashish&apos;s priority.
                    </p>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground">
                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">1. Data Collection</h3>
                        <p className="leading-relaxed">We collect minimal data: your email for authentication and your career goals to generate personalized roadmaps. Your data is stored securely using Supabase.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">2. Information Usage</h3>
                        <p className="leading-relaxed">Your career goals are shared with Gemini AI API solely for the purpose of generating your roadmap. We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">3. Security</h3>
                        <p className="leading-relaxed">We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">4. Account Deletion</h3>
                        <p className="leading-relaxed">You can request account deletion at any time by contacting Ashish at <span className="text-primary font-bold">ashishjha1304@outlook.com</span>. All your data will be permanently removed.</p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-border/40 text-center">
                    <p className="text-sm text-muted-foreground">
                        Have privacy concerns? <Link href="/#contact" className="text-primary hover:underline">Message Ashish</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
