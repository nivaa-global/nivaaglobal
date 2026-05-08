import { generatePageMetadata } from "@/lib/metadata";
import { getSettings } from "@/lib/firestore";
import { Target, Eye, Heart, Globe, Award, Users, Factory, TrendingUp, Quote } from "lucide-react";
import type { StatItem } from "@/types";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export const metadata = generatePageMetadata({
    title: "About Us",
    description:
        "Learn about NIVAA GLOBAL — a leading B2B export company from Maharashtra, India specializing in cotton t-shirts, denim jeans, and terry towels.",
    path: "/about",
    keywords: ["about NIVAA GLOBAL", "garment exporter India", "cotton manufacturer"],
});

export const revalidate = 3600;

const defaultStats: StatItem[] = [
    // { label: "Countries Served", value: "25+" },
    // { label: "B2B Clients", value: "500+" },
    // { label: "Production Capacity", value: "50K+/mo" },
    // { label: "Years of Export", value: "10+" },
];

const statIcons = [Globe, Users, Factory, TrendingUp];

export default async function AboutPage() {
    const settings = await getSettings();
    const s = settings;
    const stats = s?.stats?.length ? s.stats : defaultStats;

    return (
        <>
            {/* Hero */}
            <section className="relative bg-brand-accent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-brand-accent-light to-brand-accent" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-primary/[0.06] blur-3xl -translate-y-1/3 translate-x-1/4" />
                <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-brand-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                            About NIVAA GLOBAL
                        </span>
                        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {s?.aboutHeroTitle || "Your Trusted Partner in Premium Textile Exports"}
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {s?.aboutHeroSubtitle || "Based in Maharashtra, India — the heart of India's cotton belt — we deliver world-class quality at competitive prices."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-20 lg:py-28">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <div>
                            <h2 className="font-heading text-3xl font-bold text-brand-accent mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {s?.aboutStory || "NIVAA GLOBAL was founded with a singular mission — to bring India's finest cotton and textile products to the world stage. Based in Maharashtra, we are strategically located in India's cotton-rich region, giving us direct access to premium raw materials."}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {s?.aboutStoryExtra || "Over the years, we have built a reputation for delivering consistent quality, competitive pricing, and reliable shipping schedules. Our state-of-the-art manufacturing facilities and strict quality control processes ensure that every product meets international standards."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, idx) => {
                                const Icon = statIcons[idx % statIcons.length];
                                return (
                                    <div
                                        key={stat.label}
                                        className="bg-brand-surface rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 border border-gray-100"
                                    >
                                        <Icon className="w-7 h-7 text-brand-primary mx-auto mb-3" />
                                        <p className="text-2xl font-heading font-bold text-brand-accent">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-surface skew-y-3 origin-right translate-y-20 z-0" />
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-5">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
                                    {s?.founderImageId ? (
                                        <Image
                                            src={getCloudinaryUrl(s.founderImageId, { width: 800, height: 1000, crop: "fill" })}
                                            alt={s?.founderName || "Founder"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-brand-accent to-brand-accent-light flex items-center justify-center">
                                            <Users className="w-20 h-20 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <p className="font-heading font-bold text-2xl mb-1">{s?.founderName || "The Visionary"}</p>
                                        <p className="text-white/80 font-medium tracking-wider text-sm uppercase">{s?.founderTitle || "CEO & Founder"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-7">
                                <div className="pl-0 lg:pl-10">
                                    <span className="inline-block text-brand-primary font-bold text-xs uppercase tracking-[0.25em] mb-4">
                                        Leadership
                                    </span>
                                    <h2 className="font-heading text-4xl lg:text-5xl font-bold text-brand-accent mb-8 leading-tight">
                                        Founded on Quality & Global Trust
                                    </h2>
                                    <div className="relative">
                                        <Quote className="absolute -top-6 -left-8 w-16 h-16 text-brand-primary/10 -rotate-12" />
                                        <blockquote className="text-xl lg:text-2xl text-muted-foreground leading-relaxed italic mb-8 relative z-10 pl-2 border-l-4 border-brand-primary/30">
                                            &ldquo;{s?.founderQuote || "At NIVAA GLOBAL, our commitment goes beyond products. We build lasting partnerships with our clients by ensuring every shipment reflects our promise of quality, reliability, and value. India has some of the finest cotton and textiles in the world, and our mission is to share that excellence with businesses globally."}&rdquo;
                                        </blockquote>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-0.5 bg-brand-primary rounded-full" />
                                        <p className="font-heading font-bold text-xl text-brand-accent">
                                            {s?.founderName || "Founder"}
                                        </p>
                                    </div>
                                    <p className="text-muted-foreground mt-2 ml-16">Maharashtra, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 lg:py-28">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block text-brand-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                            Our Values
                        </span>
                        <h2 className="font-heading text-3xl font-bold text-brand-accent">
                            Mission & Export Commitment
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Target,
                                title: "Our Mission",
                                description: s?.missionText || "To be India's most trusted B2B textile exporter, delivering premium quality products with unmatched service and competitive pricing.",
                            },
                            {
                                icon: Eye,
                                title: "Our Vision",
                                description: s?.visionText || "To make Indian cotton and textiles the first choice for businesses worldwide through innovation, quality, and sustainable practices.",
                            },
                            {
                                icon: Heart,
                                title: "Our Promise",
                                description: s?.promiseText || "Every product that leaves our facility is quality-checked, ethically produced, and backed by our commitment to customer satisfaction.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="text-center p-7 rounded-2xl bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-13 h-13 mx-auto rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 w-[52px] h-[52px]">
                                    <item.icon className="w-6 h-6 text-brand-primary" />
                                </div>
                                <h3 className="font-heading font-semibold text-lg text-brand-accent mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
