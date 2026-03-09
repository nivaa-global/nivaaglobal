"use client";

import { useEffect, useState } from "react";
import { getInquiries, updateInquiryStatus, getSettings, updateSettings } from "@/lib/firestore";
import type { Inquiry, SiteSettings } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Loader2, MessageSquare, Filter, Mail, Phone, Building2, Globe, Package, MoreVertical, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

const statusOptions = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Closed", value: "closed" },
];

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        fetchData();
        fetchSettings();
    }, [statusFilter]);

    async function fetchSettings() {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    }

    async function fetchData() {
        setLoading(true);
        try {
            const data = await getInquiries(statusFilter);
            setInquiries(data);
        } catch {
            toast.error("Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: string, status: Inquiry["status"]) {
        try {
            await updateInquiryStatus(id, status);
            toast.success(`Status updated to "${status}"`);
            fetchData();
        } catch {
            toast.error("Failed to update status");
        }
    }

    async function handleUpdateEmail(e: React.FormEvent) {
        e.preventDefault();
        if (!settings) return;
        setSavingSettings(true);
        try {
            await updateSettings(settings);
            toast.success("Inquiry notification email updated");
        } catch {
            toast.error("Failed to update email settings");
        } finally {
            setSavingSettings(false);
        }
    }

    const formatDate = (date: Timestamp | Date) => {
        if (date instanceof Timestamp) {
            return format(date.toDate(), "MMM d, yyyy h:mm a");
        }
        return format(new Date(date), "MMM d, yyyy h:mm a");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new":
                return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
            case "contacted":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "closed":
                return "bg-slate-50 text-slate-500 border-slate-100";
            default:
                return "bg-gray-50 text-gray-500";
        }
    };

    const stats = {
        total: inquiries.length,
        new: inquiries.filter(i => i.status === "new").length,
        contacted: inquiries.filter(i => i.status === "contacted").length,
        closed: inquiries.filter(i => i.status === "closed").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-brand-accent">Inquiry Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and track leads from your website
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchData} 
                        disabled={loading}
                        className="rounded-xl border-gray-200"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Leads", value: stats.total, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "New Inquiries", value: stats.new, icon: Clock, color: "text-brand-primary", bg: "bg-brand-primary/5" },
                    { label: "Contacted", value: stats.contacted, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Closed", value: stats.closed, icon: XCircle, color: "text-slate-600", bg: "bg-slate-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-brand-accent mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Notification Settings Area */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:p-6 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-brand-accent">Routing & Notifications</h2>
                                <p className="text-sm text-muted-foreground">Define where inquiry emails are sent.</p>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateEmail} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={settings?.inquiryRecipientEmail || ""}
                                    onChange={(e) => settings && setSettings({ ...settings, inquiryRecipientEmail: e.target.value })}
                                    placeholder="your-email@nivaaglobal.com"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-100 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={savingSettings} 
                                className="h-11 px-8 rounded-xl bg-brand-primary hover:bg-brand-primary-dark shadow-md shadow-brand-primary/10 font-bold transition-all active:scale-95"
                            >
                                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Routing"}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Card */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <h2 className="font-bold text-brand-accent">Inquiry Records</h2>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl">
                        {statusOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setStatusFilter(opt.value)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    statusFilter === opt.value
                                        ? "bg-white text-brand-primary shadow-sm"
                                        : "text-muted-foreground hover:text-brand-accent"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
                            <p className="text-sm font-medium text-muted-foreground">Loading inquiries...</p>
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-accent">No Inquiries Found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {statusFilter === "all" 
                                    ? "Start sharing your website to generate inquiries." 
                                    : `No inquiries with status "${statusFilter}" were found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="border-gray-50 hover:bg-transparent">
                                        <TableHead className="font-bold text-brand-accent py-4">SENDER</TableHead>
                                        <TableHead className="font-bold text-brand-accent">INTERESTED IN</TableHead>
                                        <TableHead className="font-bold text-brand-accent">STATUS</TableHead>
                                        <TableHead className="font-bold text-brand-accent">DATE</TableHead>
                                        <TableHead className="text-right py-4"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inquiries.map((inquiry) => (
                                        <TableRow 
                                            key={inquiry.id} 
                                            className="border-gray-50 hover:bg-gray-50/30 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedInquiry(inquiry)}
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                                        {inquiry.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-brand-accent">{inquiry.name}</p>
                                                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Building2 className="w-3 h-3" /> {inquiry.company}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {inquiry.productName ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Package className="w-3.5 h-3.5 text-brand-primary" />
                                                        <span className="text-sm font-medium text-brand-accent">{inquiry.productName}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-muted-foreground">General Inquiry</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDate(inquiry.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="w-4 h-4 text-brand-primary" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Inquiry Details Sheet */}
            <Sheet open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
                <SheetContent className="sm:max-w-xl p-0 border-l border-gray-100">
                    {selectedInquiry && (
                        <div className="flex flex-col h-full overflow-hidden">
                            <SheetHeader className="p-6 bg-gray-50/50 border-b border-gray-100 text-left">
                                <div className="flex items-center justify-between">
                                    <Badge className={`rounded-lg ${getStatusColor(selectedInquiry.status)}`}>
                                        {selectedInquiry.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Received on {formatDate(selectedInquiry.createdAt)}
                                    </span>
                                </div>
                                <SheetTitle className="text-2xl font-bold text-brand-accent mt-4">
                                    {selectedInquiry.name}
                                </SheetTitle>
                                <SheetDescription className="text-sm">
                                    Lead from {selectedInquiry.company}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Contact Info */}
                                <section>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Contact Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                                            <a href={`mailto:${selectedInquiry.email}`} className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline">
                                                <Mail className="w-4 h-4" /> {selectedInquiry.email}
                                            </a>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                                            <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline">
                                                <Phone className="w-4 h-4" /> {selectedInquiry.phone}
                                            </a>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Region / Country</p>
                                            <p className="flex items-center gap-2 text-sm font-bold text-brand-accent">
                                                <Globe className="w-4 h-4 text-gray-400" /> {selectedInquiry.country || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Company</p>
                                            <p className="flex items-center gap-2 text-sm font-bold text-brand-accent">
                                                <Building2 className="w-4 h-4 text-gray-400" /> {selectedInquiry.company}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Inquiry Content */}
                                <section>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Inquiry Content</h4>
                                    {selectedInquiry.productName && (
                                        <div className="mb-4 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                                            <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Interested Product</p>
                                            <p className="text-sm font-bold text-brand-accent flex items-center gap-2">
                                                <Package className="w-4 h-4" /> {selectedInquiry.productName}
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Message / Requirements</p>
                                        <div className="bg-gray-50 p-5 rounded-2xl text-sm leading-relaxed text-brand-accent/90 border border-gray-100 italic">
                                            "{selectedInquiry.message}"
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="p-6 bg-white border-t border-gray-100 mt-auto">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Update Lead Status</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                        disabled={selectedInquiry.status === "contacted"}
                                        onClick={() => {
                                            handleStatusChange(selectedInquiry.id, "contacted");
                                            setSelectedInquiry({ ...selectedInquiry, status: "contacted" });
                                        }}
                                    >
                                        Mark Contacted
                                    </Button>
                                    <Button
                                        className="h-11 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold"
                                        disabled={selectedInquiry.status === "closed"}
                                        onClick={() => {
                                            handleStatusChange(selectedInquiry.id, "closed");
                                            setSelectedInquiry({ ...selectedInquiry, status: "closed" });
                                        }}
                                    >
                                        Close Lead
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
