const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function getCloudinaryUrl(
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
    }
): string {
    if (!publicId) return "/placeholder.jpg";

    const transforms: string[] = [];

    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.crop) transforms.push(`c_${options.crop}`);

    transforms.push(options?.quality || "q_auto");
    transforms.push(options?.format || "f_auto");

    const transformStr = transforms.length > 0 ? transforms.join(",") + "/" : "";

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`;
}

export function getResponsiveCloudinaryUrl(
    publicId: string,
    size: "sm" | "md" | "lg" | "xl" = "md"
): string {
    const sizes = {
        sm: { width: 400, height: 300 },
        md: { width: 800, height: 600 },
        lg: { width: 1200, height: 800 },
        xl: { width: 1920, height: 1080 },
    };

    return getCloudinaryUrl(publicId, {
        ...sizes[size],
        crop: "fill",
    });
}

export function getCloudinaryBlurUrl(publicId: string): string {
    return getCloudinaryUrl(publicId, {
        width: 20,
        quality: "q_10",
        format: "f_auto",
    });
}
