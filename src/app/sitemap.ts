import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/firestore";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nivaaglobal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories] = await Promise.all([
        getProducts({ activeOnly: true }),
        getCategories(true),
    ]);

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/certifications`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${SITE_URL}/products/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/products/item/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
}
