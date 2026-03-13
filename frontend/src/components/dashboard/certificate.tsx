"use client";

import { motion } from "framer-motion";
import { Download, Trophy, Star, ShieldCheck, Rocket, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateProps {
    userName: string;
    courseName: string;
    date: string;
    isPro: boolean;
}

export function Certificate({ userName, courseName, date, isPro }: CertificateProps) {
    const handleDownload = () => {
        if (!isPro) {
            window.dispatchEvent(new Event('open-upi-modal'));
        } else {
            const printRoot = document.getElementById('print-root');
            if (!printRoot) return;

            // Preserve original location and scroll
            const originalParent = printRoot.parentElement;
            const originalNextSibling = printRoot.nextSibling;
            
            // Move to body to bypass any nested display:none parents
            document.body.appendChild(printRoot);
            
            // Allow a small delay for DOM to settle and fonts to render
            setTimeout(() => {
                window.print();
                
                // Move back to original position
                if (originalNextSibling) {
                    originalParent?.insertBefore(printRoot, originalNextSibling);
                } else {
                    originalParent?.appendChild(printRoot);
                }
            }, 500);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out my ${courseName} Certificate!`,
                    text: `I just completed the ${courseName} roadmap on CareerRoad AI! Architected by Ashish Jha.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard! Share it with your friends.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto certificate-container"
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Spectral:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Dancing+Script:wght@700&display=swap');

                .font-cinzel { font-family: 'Cinzel', serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-spectral { font-family: 'Spectral', serif; }
                .font-dancing { font-family: 'Dancing Script', cursive; }

                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    /* Force Light Mode / High Contrast */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-scheme: light !important;
                    }
                    /* Absolute Hijack for Print */
                    body > *:not(#print-root) {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    #print-root {
                        display: flex !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        background: white !important;
                        justify-content: center !important;
                        align-items: center !important;
                        z-index: 9999999 !important;
                    }
                    .certificate-preview {
                        width: 297mm !important;
                        height: 210mm !important;
                        border: 15pt double #1e40af !important;
                        padding: 25mm !important;
                        box-sizing: border-box !important;
                        background: white !important;
                        border-radius: 0 !important;
                        color: black !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        text-align: center !important; /* Center-align all text */
                    }
                    h1 { color: #000 !important; font-family: 'Playfair Display', serif !important; font-size: 55pt !important; margin: 15pt 0 !important; }
                    h2 { color: #444 !important; font-family: 'Spectral', serif !important; font-size: 20pt !important; }
                    h3 { color: #1e40af !important; font-family: 'Cinzel', serif !important; font-size: 35pt !important; border-bottom: 2pt solid #1e40af20 !important; }
                    p { color: #222 !important; font-family: 'Cinzel', serif !important; font-size: 12pt !important; }
                    .signature-text { font-family: 'Dancing Script', cursive !important; color: #000 !important; font-size: 55pt !important; }
                    .no-print { display: none !important; }
                    .footer-divider { border-top: 2pt solid #1e40af !important; }
                }
            `}</style>
            
            <div id="print-root" className="w-full max-w-6xl mx-auto group relative">
                <div className="certificate-preview aspect-[1.414/1] w-full bg-card border-[0.5px] md:border-2 border-primary/20 rounded-[1.5rem] md:rounded-[4rem] p-6 md:p-20 lg:p-24 flex flex-col justify-between items-center relative overflow-hidden shadow-2xl transition-all duration-500 selection:bg-none">
                    
                    {/* Center Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <img 
                            src="/icon.png" 
                            alt="watermark" 
                            className="w-[60%] md:w-[500px] opacity-[0.03] grayscale transition-opacity duration-1000 group-hover:opacity-[0.06] select-none"
                        />
                    </div>

                    {/* Royal Inner Border */}
                    <div className="absolute inset-4 md:inset-8 border-[1px] border-primary/10 rounded-[1rem] md:rounded-[3rem] pointer-events-none no-print" />

                    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full -z-10 no-print" />
                    <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full -z-10 no-print" />

                    {/* Header */}
                    <div className="relative z-10 flex flex-col items-center text-center w-full">
                        <div className="flex flex-col items-center mb-4 md:mb-10 lg:mb-14">
                            <img src="/icon.png" alt="logo" className="w-10 h-10 md:w-20 lg:w-24 mb-4" />
                            <p className="font-cinzel text-[8px] md:text-sm font-black uppercase tracking-[0.4em] md:tracking-[1em] text-primary text-blue-force">
                                Certificate of Excellence
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="relative z-10 flex flex-col items-center text-center w-full flex-1 justify-center py-4">
                        <h2 className="font-spectral text-[10px] md:text-2xl font-light text-muted-foreground italic mb-2 md:mb-8 tracking-wide">
                            This certificate is proudly presented to
                        </h2>
                        <h1 className="font-playfair text-2xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 md:mb-12 text-foreground italic px-4">
                            {userName}
                        </h1>
                        <h2 className="font-spectral text-[10px] md:text-2xl font-light text-muted-foreground italic mb-2 md:mb-8 tracking-wide">
                            for successfully completing the specialized roadmap of
                        </h2>
                        <h3 className="font-cinzel text-sm md:text-4xl lg:text-5xl font-bold tracking-tight text-primary text-blue-force leading-tight uppercase border-b-2 border-primary/20 pb-4">
                            {courseName}
                        </h3>
                    </div>

                    {/* Footer Area */}
                    <div className="relative z-10 w-full mt-6 md:mt-16 pt-6 md:pt-14 border-t border-primary/10 footer-divider">
                        <div className="flex justify-between items-end w-full px-4 md:px-20">
                            {/* Date */}
                            <div className="flex-1 flex flex-col items-start gap-1">
                                <p className="font-cinzel text-[6px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Date of Issue</p>
                                <p className="font-cinzel font-black text-[8px] md:text-xl lg:text-2xl text-foreground/80 tracking-tighter">{date}</p>
                            </div>
                            
                            {/* Royal Seal */}
                            <div className="flex-1 flex flex-col items-center -mb-4 md:-mb-10">
                                <div className="p-2 md:p-8 bg-primary/5 rounded-full border-2 border-primary/10 relative shadow-inner">
                                    <ShieldCheck className="text-primary w-6 h-6 md:w-20 lg:w-24 opacity-90 text-blue-force" />
                                    <Trophy className="absolute -top-1 -right-1 text-yellow-500 w-3 h-3 md:w-10 md:h-10 no-print drop-shadow-md" />
                                </div>
                                <p className="font-cinzel text-[5px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-4">Certified Milestone</p>
                            </div>

                            {/* Signatures */}
                            <div className="flex-1 flex flex-col items-end gap-1">
                                <div className="flex flex-col items-center">
                                    <p className="font-cinzel text-[6px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 md:mb-4">Director Signature</p>
                                    <p className="signature-text italic text-lg md:text-5xl lg:text-6xl tracking-tighter text-foreground whitespace-nowrap px-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                        Ashish Jha
                                    </p>
                                    <div className="w-24 md:w-56 h-[1.5pt] bg-primary/30 mt-2" />
                                    <p className="font-cinzel text-[4px] md:text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-tighter">Authenticated Official</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRO Overlay */}
                    {!isPro && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none no-print z-50 rounded-[1.5rem] md:rounded-[4rem]">
                            <div className="flex flex-col items-center gap-6 scale-95 md:scale-110">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
                                    <Download className="text-primary w-12 h-12" />
                                </div>
                                <div className="bg-primary px-10 py-5 rounded-3xl text-white font-black text-xl md:text-2xl shadow-2xl border border-white/20 uppercase tracking-widest">
                                    Unlock Pro Certificate
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-center gap-6 no-print mt-12 md:mt-20 relative z-30">
                <Button 
                    size="lg" 
                    className="h-16 px-12 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-xl"
                    onClick={handleDownload}
                >
                    <Download className="mr-3 w-6 h-6" />
                    {isPro ? "Download Official PDF" : "Get PRO Access"}
                </Button>
                <Button 
                    size="lg" 
                    variant="outline"
                    className="h-16 px-12 rounded-3xl font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-xl"
                    onClick={handleShare}
                >
                    <Share2 className="mr-3 w-6 h-6" />
                    Share Milestone
                </Button>
            </div>
        </motion.div>
    );
}
