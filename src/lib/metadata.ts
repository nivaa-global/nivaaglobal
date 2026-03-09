import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nivaaglobal.com";

interface MetadataParams {
    title: string;
    description: string;
    path?: string;
    image?: string;
    keywords?: string[];
}

export function generatePageMetadata({
    title,
    description,
    path = "",
    image,
    keywords = [],
}: MetadataParams): Metadata {
    const url = `${SITE_URL}${path}`;
    const defaultKeywords = [
        "Cotton T-shirt exporter India",
        "Denim jeans manufacturer India",
        "Terry towel bulk exporter",
        "Wholesale garment exporter India",
        "NIVAA GLOBAL",
        "B2B garment exporter",
        "bulk cotton exports",
    ];

    return {
        title: `${title} | NIVAA GLOBAL`,
        description,
        keywords: [...defaultKeywords, ...keywords],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `${title} | NIVAA GLOBAL`,
            description,
            url,
            siteName: "NIVAA GLOBAL",
            type: "website",
            locale: "en_IN",
            ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | NIVAA GLOBAL`,
            description,
            ...(image && { images: [image] }),
        },
    };
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "NIVAA GLOBAL",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
            "NIVAA GLOBAL is a leading B2B export company specializing in cotton t-shirts, denim jeans, and terry towels from Maharashtra, India.",
        address: {
            "@type": "PostalAddress",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            availableLanguage: ["English", "Hindi"],
        },
        sameAs: [],
    };
}

export function productJsonLd(product: {
    name: string;
    description: string;
    image?: string;
    slug: string;
    fabric?: string;
    moq?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        url: `${SITE_URL}/products/item/${product.slug}`,
        brand: {
            "@type": "Brand",
            name: "NIVAA GLOBAL",
        },
        manufacturer: {
            "@type": "Organization",
            name: "NIVAA GLOBAL",
        },
        ...(product.fabric && {
            material: product.fabric,
        }),
        offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "USD",
            eligibleQuantity: {
                "@type": "QuantitativeValue",
                value: product.moq,
            },
        },
    };
}
