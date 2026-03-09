import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Gallery", href: "/gallery" },
    { label: "Certifications", href: "/certifications" },
    { label: "Contact", href: "/contact" },
];

export function Footer() {
    return (
        <footer className="bg-brand-accent text-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Main Footer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 py-14 lg:py-16">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-primary-light rounded-lg flex items-center justify-center">
                                <span className="text-white font-heading font-bold text-sm">N</span>
                            </div>
                            <div>
                                <p className="font-heading font-bold text-[15px] leading-none">NIVAA GLOBAL</p>
                                <p className="text-[10px] text-brand-primary-light font-medium tracking-[0.12em] uppercase mt-0.5">
                                    Pure Cotton Exports
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            India&apos;s trusted B2B exporter of premium cotton garments and
                            textiles. Quality fabrics for global businesses.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-4 text-white/90">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-brand-primary-light transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-4 text-white/90">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:nivaaglobal@gmail.com"
                                    className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-brand-primary-light transition-colors"
                                >
                                    <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                                    nivaaglobal@gmail.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919876543210"
                                    className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-brand-primary-light transition-colors"
                                >
                                    <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                                    +91 89751 62152
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-2.5 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    Maharashtra, India
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Copyright */}
                <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} NIVAA GLOBAL. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-500">
                        🌍 Exporting from Maharashtra, India 🇮🇳
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        💻 Developed by{" "}
                        <a
                            href="https://softvuetechnology.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 font-medium hover:text-blue-600 hover:underline transition"
                        >
                            SoftVue Technology 🚀
                        </a>
                    </p>

                </div>
            </div>
        </footer>
    );
}
