import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCategoryBySlug, getProducts, getCategories } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { generatePageMetadata } from "@/lib/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export async function generateStaticParams() {
    const categories = await getCategories(true);
    return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category: slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return {};

    return generatePageMetadata({
        title: category.name,
        description: `Browse our ${category.name} collection. Premium export-quality products available for bulk orders. ${category.description}`,
        path: `/products/${slug}`,
        keywords: [`${category.name} exporter`, `${category.name} wholesale`, `bulk ${category.name}`],
    });
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category: slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) notFound();

    const products = await getProducts({
        activeOnly: true,
        categoryId: category.id,
    });

    return (
        <>
            {/* Hero */}
            <section className="relative bg-brand-accent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent via-brand-accent-light to-brand-accent" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-brand-primary/[0.08] blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-secondary/[0.05] blur-3xl translate-y-1/2 -translate-x-1/3" />
                
                <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-24 relative z-10">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-brand-primary transition-all text-sm mb-6 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Categories
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="font-heading text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {category.name}
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-300/90 max-w-2xl leading-relaxed font-medium">
                            {category.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                            <h2 className="font-heading text-xl font-semibold text-gray-600 mb-2">
                                No products available yet
                            </h2>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Products in this category will be added soon.
                            </p>
                            <Link href="/contact">
                                <Button className="bg-brand-primary hover:bg-brand-primary-dark text-white shadow-md">
                                    Inquire About {category.name}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/item/${product.slug}`}
                                >
                                    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 h-full bg-brand-surface rounded-3xl">
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            {product.imagePublicIds?.[0] ? (
                                                <Image
                                                    src={getCloudinaryUrl(product.imagePublicIds[0], {
                                                        width: 600,
                                                        height: 600,
                                                        crop: "fill",
                                                    })}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                                    <Package className="w-12 h-12 text-gray-200 group-hover:text-brand-primary/20 transition-colors" />
                                                </div>
                                            )}
                                            {product.featured && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="inline-flex items-center gap-1 bg-brand-primary text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-lg shadow-lg">
                                                        <Star className="w-3 h-3 fill-current" /> Featured
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-heading font-bold text-lg text-brand-accent group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {product.fabric && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-gray-500 px-2 py-1 rounded border border-gray-100">
                                                        {product.fabric}
                                                    </span>
                                                )}
                                                {product.gsm && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-gray-500 px-2 py-1 rounded border border-gray-100">
                                                        {product.gsm} GSM
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div>
                                                    {product.price && (
                                                        <p className="text-brand-primary font-bold text-base">
                                                            ${product.price}<span className="text-[10px] text-muted-foreground font-normal">/{product.priceUnit || "pc"}</span>
                                                        </p>
                                                    )}
                                                    {product.moq && (
                                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                            MOQ: {product.moq}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
