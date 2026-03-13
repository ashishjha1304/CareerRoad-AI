"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                        <FileText size={12} />
                        Legal Document
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        Terms of <span className="text-primary">Service.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        Last updated: March 2026
                    </p>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground">
                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">1. Acceptance of Terms</h3>
                        <p className="leading-relaxed">By accessing and using CareerRoad AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. All code and designs are created by Ashish Jha.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">2. Use License</h3>
                        <p className="leading-relaxed">Permission is granted to temporarily use the AI-generated roadmaps for personal, non-commercial transition or educational purposes. This is the grant of a license, not a transfer of title.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">3. Pro Subscription</h3>
                        <p className="leading-relaxed">Pro features are unlocked via a one-time payment. This payment is non-refundable as it grants immediate access to premium AI features and digital certificates. Payments are verified manually by Ashish.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">4. AI Disclaimer</h3>
                        <p className="leading-relaxed">CareerRoad AI uses advanced AI models (Gemini) to generate roadmaps. While we strive for accuracy, the AI may occasionally provide information that requires manual verification. Use the roadmaps as a guide, not absolute truth.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">5. Developer Rights</h3>
                        <p className="leading-relaxed">All intellectual property rights for the platform, including its unique design and logic, belong to the developer, Ashish Jha.</p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-border/40 text-center">
                    <p className="text-sm text-muted-foreground">
                        Questions about our Terms? <Link href="/#contact" className="text-primary hover:underline">Contact Ashish</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
