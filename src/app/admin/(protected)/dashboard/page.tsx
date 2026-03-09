"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    getProductCount,
    getCategoryCount,
    getInquiryCount,
    getInquiries,
} from "@/lib/firestore";
import type { Inquiry } from "@/types";
import { Package, FolderOpen, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        inquiries: 0,
    });
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [products, categories, inquiries, recent] = await Promise.all([
                    getProductCount(),
                    getCategoryCount(),
                    getInquiryCount(),
                    getInquiries(),
                ]);
                setStats({ products, categories, inquiries });
                setRecentInquiries(recent.slice(0, 5));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const statCards = [
        {
            title: "Total Products",
            value: stats.products,
            icon: Package,
            color: "text-brand-primary",
            bg: "bg-brand-primary/10",
        },
        {
            title: "Categories",
            value: stats.categories,
            icon: FolderOpen,
            color: "text-brand-secondary",
            bg: "bg-brand-secondary/10",
        },
        {
            title: "Total Inquiries",
            value: stats.inquiries,
            icon: MessageSquare,
            color: "text-brand-accent",
            bg: "bg-brand-accent/10",
        },
    ];

    const formatDate = (date: Timestamp | Date) => {
        if (date instanceof Timestamp) {
            return format(date.toDate(), "MMM d, yyyy");
        }
        return format(new Date(date), "MMM d, yyyy");
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-brand-accent">
                    Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Welcome back! Here&apos;s an overview of your business.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border-0 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-heading font-bold mt-1">
                                        {loading ? "—" : stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}
                                >
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Inquiries */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-brand-primary" />
                        Recent Inquiries
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground py-4">Loading...</p>
                    ) : recentInquiries.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No inquiries yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentInquiries.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm truncate">{inquiry.name}</p>
                                            <Badge
                                                variant={
                                                    inquiry.status === "new"
                                                        ? "default"
                                                        : inquiry.status === "contacted"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                                className={`text-xs ${inquiry.status === "new"
                                                        ? "bg-brand-primary text-white"
                                                        : ""
                                                    }`}
                                            >
                                                {inquiry.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {inquiry.company} — {inquiry.email}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                        {formatDate(inquiry.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
