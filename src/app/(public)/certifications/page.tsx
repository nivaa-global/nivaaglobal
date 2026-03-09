import { generatePageMetadata } from "@/lib/metadata";
import { getSettings } from "@/lib/firestore";
import { Award, Shield, FileCheck, Leaf, Globe, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Certification } from "@/types";

export const metadata = generatePageMetadata({
    title: "Certifications",
    description:
        "NIVAA GLOBAL's quality certifications and export compliance. ISO certified, OEKO-TEX standard, and international quality standards.",
    path: "/certifications",
    keywords: ["ISO certified exporter", "OEKO-TEX garments", "quality certified textiles"],
});

export const revalidate = 3600;

const defaultCertifications: Certification[] = [
    {
        title: "ISO 9001:2015",
        description: "Quality Management System certification ensuring consistent product quality and continuous improvement in all our manufacturing processes.",
        status: "Certified",
    },
    {
        title: "OEKO-TEX Standard 100",
        description: "Our products are tested for harmful substances, ensuring they are safe for human use and environmentally friendly.",
        status: "Certified",
    },
    {
        title: "GOTS (Global Organic Textile Standard)",
        description: "Certification for organic textiles, covering the processing, manufacturing, and trading of organic products.",
        status: "In Process",
    },
    {
        title: "WRAP Certified",
        description: "Compliance with Worldwide Responsible Accredited Production principles for safe, lawful, humane, and ethical manufacturing.",
        status: "Certified",
    },
    {
        title: "Export License - DGFT",
        description: "Registered exporter with the Directorate General of Foreign Trade, Government of India. Valid IEC (Import Export Code).",
        status: "Active",
    },
    {
        title: "BIS Standards Compliance",
        description: "Products manufactured in compliance with Bureau of Indian Standards for textiles and garments.",
        status: "Compliant",
    },
];

const certIcons = [Shield, Leaf, FileCheck, Award, Globe, CheckCircle];

export default async function CertificationsPage() {
    const settings = await getSettings();
    const certs = settings?.certifications?.length ? settings.certifications : defaultCertifications;

    return (
        <>
            {/* Hero */}
            <section className="relative bg-brand-accent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-brand-accent-light to-brand-accent" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-brand-primary/[0.08] blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-secondary/[0.05] blur-3xl translate-y-1/2 -translate-x-1/3" />
                
                <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-28 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/[0.1] backdrop-blur-md border border-white/[0.15] rounded-full px-4 py-1.5 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-xs text-white/90 font-bold tracking-widest uppercase">
                                Global Standards
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            Certifications & Compliance
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-300/90 leading-relaxed font-medium">
                            Our commitment to excellence is verified by international standard organizations, ensuring every product meets global benchmarks.
                        </p>
                    </div>
                </div>
            </section>

            {/* Certifications Grid */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certs.map((cert, idx) => {
                            const Icon = certIcons[idx % certIcons.length];
                            const isActive = cert.status === "Certified" || cert.status === "Active" || cert.status === "Compliant";
                            return (
                                <Card
                                    key={cert.title}
                                    className="group border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-primary/20 transition-all duration-500 rounded-3xl overflow-hidden bg-brand-surface h-full"
                                >
                                    <CardContent className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:shadow-lg group-hover:shadow-brand-primary/25 transition-all duration-300">
                                                <Icon className="w-7 h-7 text-brand-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg ${isActive
                                                        ? "bg-brand-primary/10 text-brand-primary"
                                                        : "bg-amber-50 text-amber-600"
                                                    }`}
                                            >
                                                {cert.status}
                                            </span>
                                        </div>
                                        <h3 className="font-heading font-bold text-2xl text-brand-accent mb-4 group-hover:text-brand-primary transition-colors">
                                            {cert.title}
                                        </h3>
                                        <p className="text-base text-muted-foreground leading-relaxed">
                                            {cert.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quality Statement */}
            <section className="py-16 bg-brand-surface">
                <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
                    <h2 className="font-heading text-2xl lg:text-3xl font-bold text-brand-accent mb-4">
                        Our Quality Promise
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                        At NIVAA GLOBAL, every product undergoes rigorous quality checks at multiple
                        stages of production. Our certifications are a testament to our unwavering
                        commitment to delivering export-grade products that meet international standards.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-brand-primary hover:bg-brand-primary-dark text-white shadow-md shadow-brand-primary/20">
                            Request Quality Documentation
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
}
