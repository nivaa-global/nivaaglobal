import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { secret, path } = body;

        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
        }

        if (path) {
            revalidatePath(path);
        } else {
            // Revalidate all key pages
            revalidatePath("/");
            revalidatePath("/products");
            revalidatePath("/about");
        }

        return NextResponse.json({ revalidated: true });
    } catch (error) {
        console.error("Error revalidating:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
