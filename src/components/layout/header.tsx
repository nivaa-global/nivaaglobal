"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Gallery", href: "/gallery" },
    { label: "Certifications", href: "/certifications" },
    { label: "Contact", href: "/contact" },
];

export function Header() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-lg flex items-center justify-center shadow-md shadow-brand-primary/20 group-hover:shadow-lg group-hover:shadow-brand-primary/30 transition-all">
                            <span className="text-white font-heading font-bold text-sm tracking-tight">N</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-heading font-bold text-brand-accent text-[15px] tracking-tight block leading-none">
                                NIVAA GLOBAL
                            </span>
                            <span className="text-[10px] text-brand-primary font-medium tracking-[0.12em] uppercase leading-none mt-0.5 block">
                                Pure Cotton Exports
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors rounded-lg ${isActive
                                            ? "text-brand-primary bg-brand-primary/5"
                                            : "text-gray-600 hover:text-brand-accent hover:bg-gray-50"
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-brand-primary rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA + Mobile */}
                    <div className="flex items-center gap-3">
                        <Link href="https://wa.me/918975162152" className="hidden lg:block">
                            <Button
                                size="sm"
                                className="bg-brand-primary hover:bg-brand-primary-dark text-white font-medium text-[13px] shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/30 transition-all"
                            >
                                Connect Now
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        {mounted && (
                            <Sheet>
                                <SheetTrigger asChild className="lg:hidden">
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 p-0">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between p-4 border-b">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-heading font-bold text-xs">N</span>
                                                </div>
                                                <span className="font-heading font-bold text-brand-accent text-sm">
                                                    NIVAA GLOBAL
                                                </span>
                                            </div>
                                            <SheetClose asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </SheetClose>
                                        </div>
                                        <nav className="flex-1 p-4 space-y-1">
                                            {navLinks.map((link) => {
                                                const isActive = pathname === link.href ||
                                                    (link.href !== "/" && pathname.startsWith(link.href));
                                                return (
                                                    <SheetClose asChild key={link.href}>
                                                        <Link
                                                            href={link.href}
                                                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                                    ? "bg-brand-primary/10 text-brand-primary"
                                                                    : "text-gray-600 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    </SheetClose>
                                                );
                                            })}
                                        </nav>
                                        <div className="p-4 border-t">
                                            <SheetClose asChild>
                                                <Link href="/contact">
                                                    <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-medium">
                                                        Request Quote
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
