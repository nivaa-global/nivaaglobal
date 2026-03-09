import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { folder } = body;

        const timestamp = Math.round(new Date().getTime() / 1000);
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiSecret) {
            return NextResponse.json(
                { error: "Cloudinary not configured" },
                { status: 500 }
            );
        }

        const paramsToSign: Record<string, string | number> = {
            timestamp,
            folder: folder || "nivaaglobal",
        };

        // Create signature
        const sortedParams = Object.keys(paramsToSign)
            .sort()
            .map((key) => `${key}=${paramsToSign[key]}`)
            .join("&");

        const signature = crypto
            .createHash("sha256")
            .update(sortedParams + apiSecret)
            .digest("hex");

        return NextResponse.json({
            signature,
            timestamp,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            folder: folder || "nivaaglobal",
        });
    } catch (error) {
        console.error("Error generating upload signature:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
