"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { InquiryForm } from "./inquiry-form";

interface InquiryPopupProps {
    show: boolean;
    title: string;
    message: string;
    imageId?: string;
    delay?: number;
}

export function InquiryPopup({
    show,
    title,
    message,
    imageId,
    delay = 2000,
}: InquiryPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!show || !mounted) return;

        // Check if user has already seen the popup in this session
        const hasSeenPopup = sessionStorage.getItem("nivaa_inquiry_popup_seen");
        if (hasSeenPopup) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
            // Slight delay for the fade-in animation
            setTimeout(() => setIsVisible(true), 50);
        }, delay);

        return () => clearTimeout(timer);
    }, [show, delay, mounted]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("nivaa_inquiry_popup_seen", "true");
        setTimeout(() => setIsOpen(false), 300); // Wait for fade-out
    };

    // Hydration fix: only render if mounted and isOpen
    if (!mounted || !isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ease-in-out ${
                isVisible ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 backdrop-blur-none opacity-0"
            }`}
            onClick={handleClose}
        >
            <div 
                className={`relative bg-white rounded-[2rem] overflow-hidden max-w-4xl w-full shadow-2xl transition-all duration-500 transform flex flex-col md:flex-row ${
                    isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Image or Info */}
                <div className={`hidden md:flex flex-col md:w-5/12 bg-brand-primary/5 p-8 justify-center relative ${!imageId && "bg-gradient-to-br from-brand-primary to-brand-primary-dark"}`}>
                    {imageId ? (
                        <>
                            <Image
                                src={getCloudinaryUrl(imageId, { width: 800, height: 1200, crop: "fill" })}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="relative z-10 text-white mt-auto">
                                <h2 className="font-heading text-2xl font-bold mb-2">{title}</h2>
                                <p className="text-white/80 text-sm leading-relaxed">{message}</p>
                            </div>
                        </>
                    ) : (
                        <div className="text-white">
                            <h2 className="font-heading text-3xl font-bold mb-4">{title || "Get a Quote Today"}</h2>
                            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6">
                                {message || "Fill out the form to receive a personalized quote for your export needs."}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-xs font-bold">1</span>
                                    </div>
                                    <span className="text-sm">Global Shipping Support</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-xs font-bold">2</span>
                                    </div>
                                    <span className="text-sm">Premium Cotton Quality</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-xs font-bold">3</span>
                                    </div>
                                    <span className="text-sm">Fast Response Time</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-6 md:p-10 max-h-[90vh] overflow-y-auto">
                    <div className="md:hidden mb-6">
                        <h2 className="font-heading text-xl font-bold text-brand-accent mb-2">{title}</h2>
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </div>

                    <div className="mb-6 hidden md:block">
                        <h3 className="text-xl font-bold text-brand-accent">Inquiry Form</h3>
                        <p className="text-sm text-muted-foreground">Tell us about your requirements.</p>
                    </div>

                    <InquiryForm />
                </div>
            </div>
        </div>
    );
}
