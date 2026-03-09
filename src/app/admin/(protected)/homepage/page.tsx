"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Homepage CMS has been merged into Settings & CMS page
export default function AdminHomepagePage() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/settings");
    }, [router]);

    return (
        <div className="text-center py-12 text-muted-foreground">
            Redirecting to Settings & CMS...
        </div>
    );
}
