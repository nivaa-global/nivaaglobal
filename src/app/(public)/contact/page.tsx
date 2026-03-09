import { generatePageMetadata } from "@/lib/metadata";
import { getSettings } from "@/lib/firestore";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata = generatePageMetadata({
    title: "Contact Us",
    description:
        "Get in touch with NIVAA GLOBAL for bulk export inquiries. Cotton t-shirts, denim jeans, and terry towels for worldwide shipping.",
    path: "/contact",
    keywords: ["contact garment exporter", "bulk inquiry India", "export quote"],
});

export const revalidate = 3600;

export default async function ContactPage() {
    const settings = await getSettings();
    const s = settings;

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            value: s?.email || "admin@nivaaglobal.com",
            link: `mailto:${s?.email || "admin@nivaaglobal.com"}`,
            description: "For inquiries and quotations",
        },
        {
            icon: Phone,
            title: "Call Us",
            value: s?.phone || "+91 89751 62152",
            link: `tel:${(s?.phone || "+918975162152").replace(/\s/g, "")}`,
            description: "Mon-Sat, 9:00 AM - 6:00 PM IST",
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            value: s?.whatsapp || s?.phone || "+91 89751 62152",
            link: `https://wa.me/${(s?.whatsapp || s?.phone || "918975162152").replace(/[^0-9]/g, "")}`,
            description: "Quick response via WhatsApp",
        },
        {
            icon: MapPin,
            title: "Visit Us",
            value: s?.address || "Maharashtra, India",
            link: "#map",
            description: "Factory & office location",
        },
    ];

    return (
        <>
            {/* Hero */}
            <section className="relative bg-brand-accent overflow-hidden">
                <Image
                    src="/assets/factory-bg.png"
                    alt="Textile Factory Background"
                    fill
                    className="object-cover opacity-20 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-brand-accent-light to-brand-accent opacity-90" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-brand-primary/[0.08] blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-secondary/[0.05] blur-3xl translate-y-1/2 -translate-x-1/3" />

                <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-28 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/[0.1] backdrop-blur-md border border-white/[0.15] rounded-full px-4 py-1.5 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-xs text-white/90 font-bold tracking-widest uppercase">
                                Contact Our Team
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {s?.contactHeroTitle || "Let's Start Your Next Order"}
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-300/90 leading-relaxed font-medium">
                            {s?.contactHeroSubtitle || "Ready to place a bulk order? Have questions about our products? We're here to help — fill out the form or reach us directly."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-10 lg:py-14">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {contactInfo.map((info) => (
                            <a
                                key={info.title}
                                href={info.link}
                                target={info.link.startsWith("http") ? "_blank" : undefined}
                                rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                            >
                                <Card className="border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all duration-300 h-full rounded-2xl">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-11 h-11 mx-auto rounded-xl bg-brand-primary/10 flex items-center justify-center mb-3 group-hover:bg-brand-primary/20 transition-colors">
                                            <info.icon className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h3 className="font-heading font-semibold text-sm text-brand-accent mb-1">
                                            {info.title}
                                        </h3>
                                        <p className="text-brand-primary font-medium text-sm mb-0.5">
                                            {info.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{info.description}</p>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form + Map */}
            <section className="pb-20 lg:pb-28">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-brand-accent mb-2">
                                Send Us an Inquiry
                            </h2>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Fill out the form below and our team will respond within 24 hours.
                            </p>
                            <InquiryForm />
                        </div>

                        {/* Map & Additional Info */}
                        <div className="space-y-6">
                            {s?.mapEmbedUrl && (
                                <div id="map" className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 lg:h-80">
                                    <iframe
                                        src={s.mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="NIVAA GLOBAL Location"
                                    />
                                </div>
                            )}

                            <Card className="border border-gray-100 shadow-sm rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className="w-5 h-5 text-brand-primary" />
                                        <h3 className="font-heading font-semibold text-brand-accent">
                                            Business Hours
                                        </h3>
                                    </div>
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monday - Saturday</span>
                                            <span className="font-medium">{s?.businessHours || "9:00 AM - 6:00 PM IST"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sunday</span>
                                            <span className="font-medium">Closed</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <a
                                href={`https://wa.me/${(s?.whatsapp || s?.phone || "918975162152").replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-medium rounded-xl shadow-md shadow-brand-primary/20" size="lg">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Chat on WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
