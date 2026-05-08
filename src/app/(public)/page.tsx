import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Globe, Award, Truck, Shield, Package, Users, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSettings, getCategories, getProducts } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { WhyChoosePoint, StatItem } from "@/types";

const defaultSettings = {
    companyName: "NIVAA GLOBAL",
    heroTitle: "Premium Cotton Exports, Worldwide",
    heroSubtitle:
        "India's trusted B2B exporter of cotton t-shirts, denim jeans, and terry towels. Quality fabrics, competitive pricing, and reliable global shipping.",
    heroImageId: "",
    aboutText:
        "NIVAA GLOBAL is a leading B2B export company based in Maharashtra, India. We specialize in manufacturing premium cotton garments for global businesses.",
    whyChoosePoints: [
        { title: "Premium Quality", description: "ISO certified fabrics that exceed international standards" },
        { title: "Competitive Pricing", description: "Direct manufacturer pricing without middlemen" },
        { title: "Custom Labels", description: "Private label and OEM services for your brand" },
        { title: "Global Shipping", description: "Reliable delivery to 25+ countries worldwide" },
        { title: "Flexible MOQ", description: "Small to large orders accommodated" },
        { title: "Quality Certified", description: "OEKO-TEX, ISO 9001 certified production" },
    ] as WhyChoosePoint[],
    stats: [
        { label: "Years Experience", value: "01+" },
        // { label: "Countries Exported", value: "25+" },
        // { label: "Happy Clients", value: "500+" },
        // { label: "Products Delivered", value: "1M+" },
    ] as StatItem[],
};

const whyChooseIcons = [Award, Shield, Sparkles, Truck, Users, CheckCircle];

export const revalidate = 3600;

export default async function HomePage() {
    const settings = await getSettings();
    const categories = await getCategories(true);
    const featuredProducts = await getProducts({ activeOnly: true, featuredOnly: true, limitCount: 4 });
    const s = settings || defaultSettings;
    const stats = s.stats?.length ? s.stats : defaultSettings.stats;
    const points = s.whyChoosePoints?.length ? s.whyChoosePoints : defaultSettings.whyChoosePoints;

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-brand-accent overflow-hidden min-h-[600px] lg:min-h-[720px] flex items-center">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/factory-bg.webp"
                        alt="Premium Cotton Background"
                        fill
                        className="object-cover opacity-30 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent via-brand-accent/80 to-transparent" />
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-brand-primary/[0.07] blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-secondary/[0.05] blur-3xl translate-y-1/2 -translate-x-1/3" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(15,118,110,0.15),transparent_50%)]" />
                </div>

                <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-24 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/[0.1] backdrop-blur-lg border border-white/[0.15] rounded-full px-4 py-1.5 mb-8 shadow-2xl">
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-xs sm:text-sm text-white/90 font-semibold tracking-wide uppercase">
                                Global Cotton Export Leader 🇮🇳
                            </span>
                        </div>

                        <h1 className="font-heading text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.05] mb-8 tracking-tight drop-shadow-sm">
                            {s.heroTitle}
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-200/90 leading-relaxed max-w-2xl mb-12 font-medium">
                            {s.heroSubtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold shadow-2xl shadow-brand-primary/40 hover:scale-[1.02] transition-all text-base px-10 h-14 rounded-xl"
                                >
                                    Get Bulk Quote
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 bg-brand-secondary text-white hover:bg-white/10 font-bold text-base px-10 h-14 rounded-xl backdrop-blur-md hover:scale-[1.02] transition-all"
                                >
                                    Explore Products
                                </Button>
                            </Link>
                        </div>

                        {/* Stats stripe */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-10 border-t border-white/10">
                            {stats.map((stat) => (
                                <div key={stat.label} className="group cursor-default">
                                    <p className="text-3xl lg:text-4xl font-heading font-extrabold text-white group-hover:text-brand-primary transition-colors">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs lg:text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/[0.02] skew-x-12 translate-x-1/2" />
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="flex items-end justify-between mb-14">
                            <div className="max-w-2xl">
                                <span className="inline-block text-brand-primary font-bold text-xs uppercase tracking-[0.25em] mb-4">
                                    Premium Selection
                                </span>
                                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-brand-accent mb-6">
                                    Our Featured Products
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Discover our top-tier export garments, manufactured with premium cotton and precision.
                                </p>
                            </div>
                            <Link href="/products" className="hidden sm:block">
                                <Button variant="outline" className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all px-6 py-6 rounded-xl font-bold">
                                    View Full Catalog <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                            {featuredProducts.map((product) => (
                                <Link key={product.id} href={`/products/item/${product.slug}`}>
                                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-brand-surface h-full border border-gray-100/50">
                                        <div className="relative h-64 overflow-hidden">
                                            {product.imagePublicIds?.[0] ? (
                                                <Image
                                                    src={getCloudinaryUrl(product.imagePublicIds[0], { width: 600, height: 600, crop: "fill" })}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                    <Package className="w-12 h-12 text-gray-200" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1.5 bg-brand-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                                    <Star className="w-3 h-3 fill-current" /> Featured
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-heading font-bold text-xl text-brand-accent group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{product.fabric}</span>
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">MOQ: {product.moq}</span>
                                            </div>
                                            {product.price && (
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                                                    <p className="text-brand-primary font-bold text-lg">
                                                        ${product.price} <span className="text-xs text-muted-foreground font-normal">/{product.priceUnit || "pc"}</span>
                                                    </p>
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 text-center sm:hidden">
                            <Link href="/products">
                                <Button className="bg-brand-primary text-white w-full py-6 rounded-xl font-bold">
                                    View Full Catalog
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section className="py-20 lg:py-28 bg-brand-surface">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="inline-block text-brand-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                            Why NIVAA GLOBAL
                        </span>
                        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-accent mb-4">
                            Why Buyers Trust Us
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We combine quality manufacturing with reliable export services to deliver the best value for your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {points.map((point, idx) => {
                            const Icon = whyChooseIcons[idx % whyChooseIcons.length];
                            const p = typeof point === "string" ? { title: point, description: "" } : point;
                            return (
                                <div
                                    key={idx}
                                    className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:shadow-lg group-hover:shadow-brand-primary/25 transition-all duration-300">
                                        <Icon className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-brand-accent mb-1.5">
                                        {p.title}
                                    </h3>
                                    {p.description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {p.description}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About Preview */}
            <section className="py-20 lg:py-28">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <span className="inline-block text-brand-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                                About Us
                            </span>
                            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-accent mb-6 leading-tight">
                                Trusted Export Partner Since Day One
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {s.aboutText}
                            </p>
                            <Link href="/about">
                                <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
                                    Learn More About Us
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-brand-secondary/10 overflow-hidden p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto bg-brand-primary/15 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                                        <Globe className="w-10 h-10 text-brand-primary" />
                                    </div>
                                    <p className="font-heading font-bold text-2xl text-brand-accent">
                                        Exporting Excellence
                                    </p>
                                    <p className="text-muted-foreground mt-1.5">From Maharashtra, India 🇮🇳</p>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-brand-primary/10 rounded-3xl hidden lg:block" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-secondary/10 rounded-2xl hidden lg:block" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 lg:py-24 overflow-hidden">
                <Image
                    src="/assets/shipping-bg.png"
                    alt="Global Shipping Background"
                    fill
                    className="object-cover opacity-20 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-accent opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
                    <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Bulk Order?
                    </h2>
                    <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Get competitive pricing on premium cotton t-shirts, denim jeans, and terry towels.
                        Flexible minimum order quantities available.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="bg-white text-brand-primary hover:bg-gray-50 font-semibold text-[15px] px-8 h-12 shadow-xl"
                            >
                                Get Free Quote
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <a href="https://wa.me/918975162152" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/25 text-white bg-dark hover:bg-white/10 font-semibold text-[15px] px-8 h-12"
                            >
                                WhatsApp Us
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
