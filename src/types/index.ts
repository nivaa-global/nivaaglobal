import { Timestamp } from "firebase/firestore";

// ============ SITE SETTINGS ============
export interface SiteSettings {
    companyName: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageId: string;
    aboutText: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    inquiryRecipientEmail: string; // Internal email for notifications
    whyChoosePoints: WhyChoosePoint[];
    stats: StatItem[];
    // Global SEO
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    ogImageId: string;
    // About page
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutStory: string;
    aboutStoryExtra: string;
    founderName: string;
    founderTitle: string;
    founderQuote: string;
    founderImageId: string;
    missionText: string;
    visionText: string;
    promiseText: string;
    // Contact page
    contactHeroTitle: string;
    contactHeroSubtitle: string;
    mapEmbedUrl: string;
    businessHours: string;
    // Certifications
    certifications: Certification[];
    // Inquiry Popup
    showPopup: boolean;
    popupTitle: string;
    popupMessage: string;
    popupImageId: string;
    popupDelay: number; // in milliseconds
    // Email Templates
    adminEmailSubject: string;
    adminEmailBody: string;
    userEmailSubject: string;
    userEmailBody: string;
    // Gallery
    galleryImageIds: string[];
}

export interface WhyChoosePoint {
    title: string;
    description: string;
}

export interface StatItem {
    label: string;
    value: string;
}

export interface Certification {
    title: string;
    description: string;
    status: string;
}

// ============ CATEGORY ============
export interface Category {
    id: string;
    name: string;
    slug: string;
    imagePublicId: string;
    description: string;
    order: number;
    active: boolean;
}

// ============ PRODUCT ============
export interface Product {
    id: string;
    name: string;
    slug: string;
    categoryId?: string;
    imagePublicIds: string[];
    fabric: string;
    gsm: string;
    sizes: string[];
    colors: string[];
    moq: string;
    price: string;
    priceUnit: string;
    description: string;
    shortDescription: string;
    specifications: Record<string, string>;
    featured: boolean;
    active: boolean;
    createdAt: Timestamp | Date;
}

// ============ INQUIRY ============
export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    message: string;
    productId?: string;
    productName?: string;
    status: "new" | "contacted" | "closed";
    createdAt: Timestamp | Date;
}

// ============ FORM TYPES ============
export type ProductFormData = Omit<Product, "id" | "createdAt">;
export type CategoryFormData = Omit<Category, "id">;
export type InquiryFormData = Omit<Inquiry, "id" | "status" | "createdAt">;
