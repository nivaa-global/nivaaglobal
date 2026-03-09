import { getSettings } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Product Gallery | NIVAA GLOBAL",
    description: "Explore our premium fabric collection and manufacturing facility photos.",
};

export default async function GalleryPage() {
    const settings = await getSettings();
    const images = settings?.galleryImageIds || [];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 bg-gradient-to-b from-brand-primary/5 to-white">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/10">
                            Our Collection
                        </Badge>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-accent mb-6">
                            Visual Showcase
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Explore our premium fabric manufacturing facility and our diverse range of high-quality export products.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="pb-24">
                <div className="container px-4 mx-auto">
                    {images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {images.map((id, index) => (
                                <Card 
                                    key={id} 
                                    className="group overflow-hidden rounded-2xl border-none shadow-premium hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <Image
                                            src={getCloudinaryUrl(id, {
                                                width: 800,
                                                height: 1000,
                                                crop: "fill",
                                            })}
                                            alt={`Gallery item ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                            <p className="text-white/80 text-sm font-medium">NIVAA GLOBAL Quality</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-brand-surface rounded-3xl border border-dashed border-gray-200">
                            <p className="text-muted-foreground">The gallery is currently being updated. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
