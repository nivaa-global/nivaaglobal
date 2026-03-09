import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { getSettings } from "@/lib/firestore";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { InquiryPopup } from "@/components/shared/inquiry-popup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nivaaglobal.com";
  
  const title = settings?.seoTitle || "NIVAA GLOBAL | Pure Cotton Worldwide Export";
  const description = settings?.seoDescription || "NIVAA GLOBAL is a leading B2B export company from Maharashtra, India specializing in cotton t-shirts, denim jeans, and terry towels.";
  const keywords = settings?.seoKeywords ? settings.seoKeywords.split(",").map(k => k.trim()) : [
    "Cotton T-shirt exporter India",
    "Denim jeans manufacturer India",
    "Terry towel bulk exporter",
    "Wholesale garment exporter India",
    "NIVAA GLOBAL",
  ];

  const ogImage = settings?.ogImageId 
    ? getCloudinaryUrl(settings.ogImageId, { width: 1200, height: 630, crop: "fill" })
    : `${siteUrl}/og-image.jpg`;

  return {
    title: {
      default: title,
      template: `%s | ${settings?.companyName || "NIVAA GLOBAL"}`,
    },
    description,
    keywords,
    authors: [{ name: settings?.companyName || "NIVAA GLOBAL" }],
    creator: settings?.companyName || "NIVAA GLOBAL",
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: settings?.companyName || "NIVAA GLOBAL",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NIVAA GLOBAL",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://nivaaglobal.com",
              description:
                "Leading B2B export company specializing in cotton t-shirts, denim jeans, and terry towels from Maharashtra, India.",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
        {!( (await headers()).get("x-url")?.includes("/admin") || (await headers()).get("referer")?.includes("/admin")) && (
          <InquiryPopup 
            show={settings?.showPopup || false}
            title={settings?.popupTitle || ""}
            message={settings?.popupMessage || ""}
            imageId={settings?.popupImageId}
            delay={settings?.popupDelay}
          />
        )}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
