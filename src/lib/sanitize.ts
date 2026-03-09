/**
 * Sanitize a string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;")
        .trim();
}

/**
 * Sanitize an object's string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        const value = sanitized[key];
        if (typeof value === "string") {
            (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
        } else if (Array.isArray(value)) {
            (sanitized as Record<string, unknown>)[key] = value.map((item) =>
                typeof item === "string" ? sanitizeString(item) : item
            );
        }
    }
    return sanitized;
}

/**
 * Generate a slug from a string
 */
export function generateSlug(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
