import { z } from "zod";

export const inquirySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
        .string()
        .min(7, "Phone number must be at least 7 digits")
        .max(20, "Phone number must be less than 20 digits"),
    company: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(200, "Company name must be less than 200 characters"),
    country: z
        .string()
        .min(2, "Country is required")
        .max(100, "Country must be less than 100 characters"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must be less than 2000 characters"),
    productId: z.string().optional(),
    productName: z.string().optional(),
});

export const productSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(200, "Name must be less than 200 characters"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
    categoryId: z.string().optional(),
    imagePublicIds: z.array(z.string()).default([]),
    fabric: z.string().min(1, "Fabric is required"),
    gsm: z.string().min(1, "GSM is required"),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    colors: z.array(z.string()).default([]),
    moq: z.string().min(1, "MOQ is required"),
    price: z.string().default(""),
    priceUnit: z.string().default("per piece"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description must be less than 5000 characters"),
    shortDescription: z.string().max(300).default(""),
    specifications: z.record(z.string(), z.string()).default({}),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
});

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
    imagePublicId: z.string().default(""),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must be less than 1000 characters"),
    order: z.number().int().min(0).default(0),
    active: z.boolean().default(true),
});

export const settingsSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    heroTitle: z.string().min(1, "Hero title is required"),
    heroSubtitle: z.string().min(1, "Hero subtitle is required"),
    heroImageId: z.string().default(""),
    aboutText: z.string().min(1, "About text is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(7, "Phone number is required"),
    whatsapp: z.string().min(1, "WhatsApp is required"),
    address: z.string().min(1, "Address is required"),
    inquiryRecipientEmail: z.string().email("Invalid inquiry email").optional().or(z.literal("")),
    whyChoosePoints: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })).default([]),
    stats: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })).default([]),
    // SEO
    seoTitle: z.string().default(""),
    seoDescription: z.string().default(""),
    seoKeywords: z.string().default(""),
    ogImageId: z.string().default(""),
    // About Page
    aboutHeroTitle: z.string().default(""),
    aboutHeroSubtitle: z.string().default(""),
    aboutStory: z.string().default(""),
    aboutStoryExtra: z.string().default(""),
    founderName: z.string().default(""),
    founderTitle: z.string().default(""),
    founderQuote: z.string().default(""),
    founderImageId: z.string().default(""),
    missionText: z.string().default(""),
    visionText: z.string().default(""),
    promiseText: z.string().default(""),
    // Contact Page
    contactHeroTitle: z.string().default(""),
    contactHeroSubtitle: z.string().default(""),
    mapEmbedUrl: z.string().default(""),
    businessHours: z.string().default(""),
    // Welcome Popup
    showPopup: z.boolean().default(false),
    popupTitle: z.string().default(""),
    popupMessage: z.string().default(""),
    popupImageId: z.string().default(""),
    popupDelay: z.number().min(0).default(2000),
    // Email Templates
    adminEmailSubject: z.string().default("New Export Inquiry: {{name}}"),
    adminEmailBody: z.string().default("You have received a new inquiry from {{name}} ({{company}}).\n\nProduct: {{productName}}\nMessage: {{message}}\n\nContact: {{email}} | {{phone}}"),
    userEmailSubject: z.string().default("Thank you for your inquiry - NIVAA GLOBAL"),
    userEmailBody: z.string().default("Dear {{name}},\n\nThank you for reaching out to NIVAA GLOBAL. We have received your inquiry regarding {{productName}} and our team will get back to you shortly.\n\nBest Regards,\nNIVAA GLOBAL Team"),
    galleryImageIds: z.array(z.string()).default([]),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type SettingsFormValues = z.infer<typeof settingsSchema>;
