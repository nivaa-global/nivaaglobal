"use client";

import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <main className="lg:ml-64 pt-14 lg:pt-0">
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
            </div>
        </AuthGuard>
    );
}
