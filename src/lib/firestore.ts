import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Category, Inquiry, SiteSettings } from "@/types";

// ============ SETTINGS ============

export async function getSettings(): Promise<SiteSettings | null> {
    try {
        const docRef = doc(db, "settings", "site");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings;
        }
        return null;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, "settings", "site");
    await setDoc(docRef, data, { merge: true });
}

// ============ CATEGORIES ============

export async function getCategories(activeOnly = false): Promise<Category[]> {
    try {
        const q = query(collection(db, "categories"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Category[];
        
        return activeOnly ? categories.filter(c => c.active) : categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const q = query(collection(db, "categories"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Category;
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

export async function createCategory(data: Omit<Category, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, "categories"), data);
    return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
    await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, "categories", id));
}

// ============ PRODUCTS ============

export async function getProducts(options?: {
    activeOnly?: boolean;
    featuredOnly?: boolean;
    categoryId?: string;
    limitCount?: number;
}): Promise<Product[]> {
    try {
        const constraints: Parameters<typeof query>[1][] = [];

        // To avoid mandatory composite indexes, we only query the categoryId on the server
        // and handle flags (active/featured) in-memory if possible.
        if (options?.categoryId) {
            constraints.push(where("categoryId", "==", options.categoryId));
        }

        constraints.push(orderBy("createdAt", "desc"));

        if (options?.limitCount && !options.activeOnly && !options.featuredOnly) {
            constraints.push(limit(options.limitCount));
        }

        const q = query(collection(db, "products"), ...constraints);
        const snapshot = await getDocs(q);
        let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];

        // Apply filters in-memory to prevent Firebase "Index Required" errors
        if (options?.activeOnly) {
            products = products.filter(p => p.active);
        }
        if (options?.featuredOnly) {
            products = products.filter(p => p.featured);
        }
        
        // Apply limit after in-memory filtering if flags were used
        if (options?.limitCount && (options.activeOnly || options.featuredOnly)) {
            products = products.slice(0, options.limitCount);
        }

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const q = query(collection(db, "products"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function createProduct(
    data: Omit<Product, "id" | "createdAt">
): Promise<string> {
    const docRef = await addDoc(collection(db, "products"), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
    await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
}

// ============ INQUIRIES ============

export async function getInquiries(statusFilter?: string): Promise<Inquiry[]> {
    try {
        let q;
        if (statusFilter && statusFilter !== "all") {
            q = query(
                collection(db, "inquiries"),
                where("status", "==", statusFilter),
                orderBy("createdAt", "desc")
            );
        } else {
            q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Inquiry[];
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return [];
    }
}

export async function createInquiry(
    data: Omit<Inquiry, "id" | "status" | "createdAt">
): Promise<string> {
    const docRef = await addDoc(collection(db, "inquiries"), {
        ...data,
        status: "new",
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateInquiryStatus(
    id: string,
    status: Inquiry["status"]
): Promise<void> {
    await updateDoc(doc(db, "inquiries", id), { status });
}

export async function getInquiryCount(): Promise<number> {
    try {
        const snapshot = await getDocs(collection(db, "inquiries"));
        return snapshot.size;
    } catch (error) {
        console.error("Error counting inquiries:", error);
        return 0;
    }
}

export async function getProductCount(): Promise<number> {
    try {
        const snapshot = await getDocs(collection(db, "products"));
        return snapshot.size;
    } catch (error) {
        console.error("Error counting products:", error);
        return 0;
    }
}

export async function getCategoryCount(): Promise<number> {
    try {
        const snapshot = await getDocs(collection(db, "categories"));
        return snapshot.size;
    } catch (error) {
        console.error("Error counting categories:", error);
        return 0;
    }
}
