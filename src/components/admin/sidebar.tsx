"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Home,
    Settings,
    MessageSquare,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const sidebarLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Settings & CMS", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push("/admin/login");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-heading font-bold text-sm">N</span>
                    </div>
                    <span className="font-heading font-semibold text-sm">Admin</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Mobile overlay */}
            {!collapsed && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen bg-white border-r transition-all duration-300 ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-white font-heading font-bold">N</span>
                            </div>
                            {!collapsed && (
                                <div>
                                    <p className="font-heading font-bold text-sm text-brand-accent">
                                        NIVAA GLOBAL
                                    </p>
                                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex h-8 w-8"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <ChevronLeft
                                className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""
                                    }`}
                            />
                        </Button>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setCollapsed(true);
                                    }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-brand-primary/10 text-brand-primary"
                                        : "text-gray-600 hover:text-brand-primary hover:bg-gray-50"
                                        }`}
                                    title={collapsed ? link.label : undefined}
                                >
                                    <link.icon className="w-5 h-5 shrink-0" />
                                    {!collapsed && <span>{link.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t space-y-1">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-brand-primary hover:bg-gray-50 transition-all"
                        >
                            <Home className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>View Site</span>}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all w-full"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
