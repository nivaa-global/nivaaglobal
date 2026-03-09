/**
 * NIVAA GLOBAL - Sample Seed Data
 *
 * Run this manually to populate your Firestore with demo data.
 * Usage: Copy and paste the data into your Firebase Console or
 * use the Firebase Admin SDK to add the documents.
 */

export const seedSettings = {
    companyName: "NIVAA GLOBAL",
    heroTitle: "Premium Cotton Exports, Worldwide",
    heroSubtitle:
        "India's trusted B2B exporter of cotton t-shirts, denim jeans, and terry towels. Quality fabrics, competitive pricing, and reliable global shipping.",
    aboutText:
        "NIVAA GLOBAL is a leading B2B export company based in Maharashtra, India. We specialize in manufacturing and exporting premium quality cotton garments and textiles to businesses worldwide. With over 10 years of experience, we serve 500+ clients across 25+ countries.",
    email: "info@nivaaglobal.com",
    phone: "+91 98765 43210",
    address: "Maharashtra, India",
    whyChoosePoints: [
        "Premium Quality Fabrics",
        "Competitive Export Pricing",
        "Customization Available",
        "On-Time Global Delivery",
        "Minimum Order Flexibility",
        "Quality Certifications",
    ],
};

export const seedCategories = [
    {
        name: "Cotton T-Shirts",
        slug: "cotton-tshirts",
        imagePublicId: "",
        description:
            "Premium 100% cotton t-shirts in various styles — round neck, polo, V-neck. Available in all sizes and colors for bulk export.",
        order: 1,
        active: true,
    },
    {
        name: "Denim Jeans",
        slug: "denim-jeans",
        imagePublicId: "",
        description:
            "High-quality denim jeans with multiple washes and fits. Men's and women's collections for international markets.",
        order: 2,
        active: true,
    },
    {
        name: "Terry Towels",
        slug: "terry-towels",
        imagePublicId: "",
        description:
            "Luxuriously soft terry towels in hotel-grade quality. Bath towels, hand towels, and face towels for bulk buyers.",
        order: 3,
        active: true,
    },
];

export const seedProducts = [
    {
        name: "Classic Round Neck Cotton T-Shirt",
        slug: "classic-round-neck-cotton-tshirt",
        categoryId: "", // Will be set to cotton-tshirts category ID
        imagePublicIds: [],
        fabric: "100% Combed Cotton",
        gsm: "180",
        sizes: ["S", "M", "L", "XL", "XXL"],
        moq: "500 pcs",
        description:
            "Our classic round neck t-shirt is made from 100% combed cotton for maximum comfort and durability. Pre-shrunk fabric, double-stitched hems, and available in 20+ colors. Perfect for private label brands and retail chains.",
        specifications: {
            "Fabric": "100% Combed Cotton",
            "GSM": "180",
            "Fit": "Regular Fit",
            "Neck": "Round Neck",
            "Sleeve": "Half Sleeve",
            "Stitch": "Double Needle Stitching",
            "Colors": "20+ colors available",
            "Print": "Screen Print / DTG ready",
        },
        featured: true,
        active: true,
    },
    {
        name: "Premium Polo Cotton T-Shirt",
        slug: "premium-polo-cotton-tshirt",
        categoryId: "",
        imagePublicIds: [],
        fabric: "Cotton Pique",
        gsm: "220",
        sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
        moq: "300 pcs",
        description:
            "Premium polo t-shirt crafted from cotton pique fabric with a flat-knit collar and button placket. Perfect for corporate uniforms, sports teams, and retail brands.",
        specifications: {
            "Fabric": "Cotton Pique",
            "GSM": "220",
            "Fit": "Classic Fit",
            "Collar": "Flat Knit Collar",
            "Placket": "3-Button Placket",
            "Colors": "15+ colors",
        },
        featured: true,
        active: true,
    },
    {
        name: "Slim Fit Stretch Denim Jeans",
        slug: "slim-fit-stretch-denim-jeans",
        categoryId: "",
        imagePublicIds: [],
        fabric: "98% Cotton, 2% Elastane",
        gsm: "340",
        sizes: ["28", "30", "32", "34", "36", "38"],
        moq: "200 pcs",
        description:
            "Modern slim fit denim jeans with stretch for comfort. Available in multiple washes including raw, light, medium, and dark indigo. 5-pocket construction with YKK zippers.",
        specifications: {
            "Fabric": "98% Cotton, 2% Elastane",
            "Weight": "10-12 oz",
            "Fit": "Slim Fit",
            "Rise": "Mid Rise",
            "Wash": "Multiple options",
            "Zipper": "YKK",
        },
        featured: true,
        active: true,
    },
    {
        name: "Luxury Hotel Terry Bath Towel",
        slug: "luxury-hotel-terry-bath-towel",
        categoryId: "",
        imagePublicIds: [],
        fabric: "100% Ring Spun Cotton",
        gsm: "550",
        sizes: ["30x60 inch", "27x54 inch"],
        moq: "1000 pcs",
        description:
            "Hotel-grade luxury bath towel made from 100% ring spun cotton terry. Highly absorbent, soft to touch, and durable after multiple washes. Perfect for hotels, spas, and retail.",
        specifications: {
            "Fabric": "100% Ring Spun Cotton",
            "GSM": "550",
            "Type": "Terry Towel",
            "Border": "Dobby Border",
            "Colors": "White, Ivory, Gray + Custom",
            "Washing": "Industrial wash safe",
        },
        featured: true,
        active: true,
    },
];

/*
 * To seed data via Firebase Console:
 * 1. Go to Firebase Console > Firestore Database
 * 2. Create "settings" collection with doc ID "site" and paste seedSettings
 * 3. Create "categories" collection and add each seedCategory as a new doc
 * 4. Note the category doc IDs
 * 5. Create "products" collection, set categoryId to the matching category ID
 * 6. Add a createdAt field as Timestamp for each product
 */
