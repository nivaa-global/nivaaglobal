import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getProducts, getCategories, getSettings } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { generatePageMetadata, productJsonLd } from "@/lib/metadata";
import { ImageGallery } from "@/components/shared/cloudinary-image";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { Package, Layers, Ruler, ShoppingBag, Info, Tag, Palette, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export async function generateStaticParams() {
    const products = await getProducts({ activeOnly: true });
    return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return {};

    return generatePageMetadata({
        title: product.name,
        description: `${product.name} — ${product.description?.slice(0, 150)}. Available for bulk export orders from NIVAA GLOBAL.`,
        path: `/products/item/${slug}`,
        image: product.imagePublicIds?.[0]
            ? getCloudinaryUrl(product.imagePublicIds[0], { width: 1200, height: 630, crop: "fill" })
            : undefined,
        keywords: [`${product.name} exporter`, product.fabric, `bulk ${product.name}`],
    });
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const settings = await getSettings();
    const categories = await getCategories();
    const category = categories.find((c) => c.id === product.categoryId);

    const jsonLd = productJsonLd({
        name: product.name,
        description: product.description,
        image: product.imagePublicIds?.[0]
            ? getCloudinaryUrl(product.imagePublicIds[0], { width: 800, height: 800 })
            : undefined,
        slug: product.slug,
        fabric: product.fabric,
        moq: product.moq,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className="py-8 lg:py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link href="/products" className="hover:text-brand-primary transition-colors">
                            Products
                        </Link>
                        <span className="text-gray-300">/</span>
                        {category && (
                            <>
                                <Link
                                    href={`/products/${category.slug}`}
                                    className="hover:text-brand-primary transition-colors"
                                >
                                    {category.name}
                                </Link>
                                <span className="text-gray-300">/</span>
                            </>
                        )}
                        <span className="text-foreground font-medium truncate">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
                        {/* Gallery */}
                        <div>
                            <ImageGallery
                                publicIds={product.imagePublicIds || []}
                                alt={product.name}
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {product.featured && (
                                    <Badge className="bg-brand-primary text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-lg shadow-sm border-0">★ Featured</Badge>
                                )}
                                {category && (
                                    <Badge variant="outline" className="text-brand-primary border-brand-primary/20 bg-brand-primary/5 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg">
                                        {category.name}
                                    </Badge>
                                )}
                            </div>

                            <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-brand-accent mb-6 leading-tight tracking-tight">
                                {product.name}
                            </h1>

                            {/* Price */}
                            {product.price && (
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-heading font-bold text-brand-primary">
                                        ${product.price}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        /{product.priceUnit || "piece"}
                                    </span>
                                    <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-medium ml-2">
                                        FOB Price
                                    </span>
                                </div>
                            )}

                            {product.shortDescription && (
                                <p className="text-muted-foreground leading-relaxed mb-4 text-[15px]">
                                    {product.shortDescription}
                                </p>
                            )}

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {product.fabric && (
                                    <div className="flex items-center gap-3 p-3.5 bg-brand-surface rounded-xl border border-gray-100">
                                        <Layers className="w-5 h-5 text-brand-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Fabric</p>
                                            <p className="text-sm font-medium">{product.fabric}</p>
                                        </div>
                                    </div>
                                )}
                                {product.gsm && (
                                    <div className="flex items-center gap-3 p-3.5 bg-brand-surface rounded-xl border border-gray-100">
                                        <Info className="w-5 h-5 text-brand-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">GSM</p>
                                            <p className="text-sm font-medium">{product.gsm}</p>
                                        </div>
                                    </div>
                                )}
                                {product.moq && (
                                    <div className="flex items-center gap-3 p-3.5 bg-brand-surface rounded-xl border border-gray-100">
                                        <ShoppingBag className="w-5 h-5 text-brand-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">MOQ</p>
                                            <p className="text-sm font-medium">{product.moq}</p>
                                        </div>
                                    </div>
                                )}
                                {product.sizes?.length > 0 && (
                                    <div className="flex items-center gap-3 p-3.5 bg-brand-surface rounded-xl border border-gray-100">
                                        <Ruler className="w-5 h-5 text-brand-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Sizes</p>
                                            <p className="text-sm font-medium">{product.sizes.join(", ")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Colors */}
                            {product.colors?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Palette className="w-3.5 h-3.5" /> Available Colors
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.colors.map((color) => (
                                            <span key={color} className="text-xs bg-brand-surface border border-gray-200 px-2.5 py-1 rounded-full">
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="#inquiry" className="flex-[2]">
                                    <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold shadow-2xl shadow-brand-primary/40 transition-all hover:scale-[1.02] active:scale-95 h-14 rounded-xl text-base" size="lg">
                                        Request Export Quote
                                    </Button>
                                </Link>
                                <a href={`https://wa.me/${(settings?.whatsapp || settings?.phone || "918975162152").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button variant="outline" className="w-full border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white font-bold h-14 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-95" size="lg">
                                        WhatsApp
                                    </Button>
                                </a>
                            </div>

                            {/* Specifications Table */}
                            {product.specifications &&
                                Object.keys(product.specifications).length > 0 && (
                                    <>
                                        <Separator className="my-8" />
                                        <h3 className="font-heading font-semibold text-lg mb-4">
                                            Specifications
                                        </h3>
                                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                                            <table className="w-full">
                                                <tbody>
                                                    {Object.entries(product.specifications).map(
                                                        ([key, value], idx) => (
                                                            <tr
                                                                key={key}
                                                                className={idx % 2 === 0 ? "bg-brand-surface" : "bg-white"}
                                                            >
                                                                <td className="px-4 py-3 text-sm font-medium text-brand-accent w-2/5">
                                                                    {key}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                                    {value}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    <div id="inquiry" className="mt-16 lg:mt-20">
                        <Separator className="mb-14" />
                        <div className="max-w-2xl mx-auto">
                            <h2 className="font-heading text-2xl font-bold text-brand-accent text-center mb-2">
                                Interested in This Product?
                            </h2>
                            <p className="text-muted-foreground text-center mb-8">
                                Send us your bulk inquiry and our team will get back to you within 24 hours.
                            </p>
                            <InquiryForm productId={product.id} productName={product.name} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
