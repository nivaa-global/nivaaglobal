import Link from "next/link";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { ArrowRight, Package, Info, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = generatePageMetadata({
    title: "Our Products",
    description:
        "Explore our range of premium export-quality products — cotton t-shirts, denim jeans, and terry towels. Bulk orders welcome.",
    path: "/products",
    keywords: [
        "cotton t-shirts export",
        "denim jeans wholesale",
        "terry towels bulk",
        "Indian garment exporter",
    ],
});

export const revalidate = 3600;

export default async function ProductsPage() {
    const products = await getProducts({ activeOnly: true });

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
                                Export Catalog
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            Premium Export Collections
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-300/90 leading-relaxed font-medium">
                            Discover our world-class garment range. From 100% pure cotton to rugged denim, we manufacture for the global market.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                            <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-brand-accent mb-2">No Products Available</h2>
                            <p className="text-muted-foreground">We are currently updating our catalog. Please check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {products.map((product) => (
                                <Link key={product.id} href={`/products/item/${product.slug}`}>
                                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 h-full bg-white rounded-[2rem] border border-gray-50">
                                        <div className="relative h-80 overflow-hidden">
                                            {product.imagePublicIds?.[0] ? (
                                                <Image
                                                    src={getCloudinaryUrl(product.imagePublicIds[0], {
                                                        width: 800, height: 800, crop: "fill",
                                                    })}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                                    <Package className="w-16 h-16 text-gray-200 group-hover:text-brand-primary/20 transition-colors" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                {product.featured && (
                                                    <Badge className="bg-brand-primary/95 backdrop-blur-md text-white border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                        Featured
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="bg-white/90 backdrop-blur-md text-brand-accent border-gray-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    <Tag className="w-3 h-3 mr-1" /> Export Quality
                                                </Badge>
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <CardContent className="p-8">
                                            <h2 className="font-heading font-bold text-2xl text-brand-accent group-hover:text-brand-primary transition-colors duration-300 mb-4">
                                                {product.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {product.fabric && (
                                                    <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md uppercase border border-gray-100">
                                                        {product.fabric}
                                                    </span>
                                                )}
                                                {product.gsm && (
                                                    <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md uppercase border border-gray-100">
                                                        {product.gsm} GSM
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-8">
                                                {product.shortDescription || product.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-brand-primary font-bold text-[13px] uppercase tracking-wider">
                                                    Details <Info className="w-4 h-4" />
                                                </div>
                                                <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
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

