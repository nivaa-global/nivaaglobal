"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/firestore";
import type { SiteSettings, WhyChoosePoint, StatItem, Certification } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Plus, X, Building2, Globe, FileText, Phone, Award, Home, Search, Share2, Bell, Mail } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getSettings();
                if (data) setSettings(data);
            } catch { toast.error("Failed to load settings"); }
            finally { setLoading(false); }
        }
        load();
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            await updateSettings(settings);
            toast.success("Settings saved successfully");
        } catch { toast.error("Failed to save"); }
        finally { setSaving(false); }
    }

    // Helper for stats
    function updateStat(idx: number, field: keyof StatItem, value: string) {
        const stats = [...(settings.stats || [])];
        stats[idx] = { ...stats[idx], [field]: value };
        setSettings({ ...settings, stats });
    }
    function addStat() {
        setSettings({ ...settings, stats: [...(settings.stats || []), { label: "", value: "" }] });
    }
    function removeStat(idx: number) {
        setSettings({ ...settings, stats: (settings.stats || []).filter((_, i) => i !== idx) });
    }

    // Helper for why choose points
    function updatePoint(idx: number, field: keyof WhyChoosePoint, value: string) {
        const pts = [...(settings.whyChoosePoints || [])];
        pts[idx] = { ...pts[idx], [field]: value };
        setSettings({ ...settings, whyChoosePoints: pts });
    }
    function addPoint() {
        setSettings({ ...settings, whyChoosePoints: [...(settings.whyChoosePoints || []), { title: "", description: "" }] });
    }
    function removePoint(idx: number) {
        setSettings({ ...settings, whyChoosePoints: (settings.whyChoosePoints || []).filter((_, i) => i !== idx) });
    }

    // Certifications
    function updateCert(idx: number, field: keyof Certification, value: string) {
        const certs = [...(settings.certifications || [])];
        certs[idx] = { ...certs[idx], [field]: value };
        setSettings({ ...settings, certifications: certs });
    }
    function addCert() {
        setSettings({ ...settings, certifications: [...(settings.certifications || []), { title: "", description: "", status: "Certified" }] });
    }
    function removeCert(idx: number) {
        setSettings({ ...settings, certifications: (settings.certifications || []).filter((_, i) => i !== idx) });
    }

    if (loading) {
        return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-brand-accent">Settings & CMS</h1>
                    <p className="text-sm text-muted-foreground mt-1">Edit all website content from here</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save All Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-brand-surface border border-gray-100">
                    <TabsTrigger value="general"><Building2 className="w-3.5 h-3.5 mr-1.5" /> General</TabsTrigger>
                    <TabsTrigger value="home"><Home className="w-3.5 h-3.5 mr-1.5" /> Home</TabsTrigger>
                    <TabsTrigger value="about"><FileText className="w-3.5 h-3.5 mr-1.5" /> About</TabsTrigger>
                    <TabsTrigger value="contact"><Phone className="w-3.5 h-3.5 mr-1.5" /> Contact</TabsTrigger>
                    <TabsTrigger value="certs"><Award className="w-3.5 h-3.5 mr-1.5" /> Certifications</TabsTrigger>
                    <TabsTrigger value="seo"><Search className="w-3.5 h-3.5 mr-1.5" /> SEO Config</TabsTrigger>
                    <TabsTrigger value="popup"><Bell className="w-3.5 h-3.5 mr-1.5" /> Inquiry Popup</TabsTrigger>
                    <TabsTrigger value="emails"><Mail className="w-3.5 h-3.5 mr-1.5" /> Email Templates</TabsTrigger>
                    <TabsTrigger value="gallery"><Building2 className="w-3.5 h-3.5 mr-1.5" /> Photo Gallery</TabsTrigger>
                </TabsList>

                {/* GENERAL */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Company Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Company Name</Label>
                                <Input value={settings.companyName || ""} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Email</Label>
                                    <Input type="email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Phone</Label>
                                    <Input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>WhatsApp Number</Label>
                                    <Input value={settings.whatsapp || ""} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="+918975162152" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Address</Label>
                                    <Input value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-heading text-lg">Stats (shown on home & about)</CardTitle>
                            <Button variant="outline" size="sm" onClick={addStat}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(settings.stats || []).map((stat, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Input placeholder="Value (e.g. 25+)" value={stat.value} onChange={(e) => updateStat(idx, "value", e.target.value)} className="w-32" />
                                    <Input placeholder="Label (e.g. Countries)" value={stat.label} onChange={(e) => updateStat(idx, "label", e.target.value)} className="flex-1" />
                                    <Button variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => removeStat(idx)}><X className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            {(!settings.stats || settings.stats.length === 0) && <p className="text-sm text-muted-foreground">No stats yet. Click Add to create.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HOME */}
                <TabsContent value="home" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Hero Section</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Hero Title</Label>
                                <Input value={settings.heroTitle || ""} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Hero Subtitle</Label>
                                <Textarea value={settings.heroSubtitle || ""} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} rows={3} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">About Preview</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-1.5">
                                <Label>About Text (shown on homepage)</Label>
                                <Textarea value={settings.aboutText || ""} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} rows={4} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-heading text-lg">Why Choose Us Points</CardTitle>
                            <Button variant="outline" size="sm" onClick={addPoint}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(settings.whyChoosePoints || []).map((point, idx) => {
                                const p = typeof point === "string" ? { title: point, description: "" } : point;
                                return (
                                    <div key={idx} className="border border-gray-100 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="Title" value={p.title} onChange={(e) => updatePoint(idx, "title", e.target.value)} className="flex-1" />
                                            <Button variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => removePoint(idx)}><X className="w-4 h-4" /></Button>
                                        </div>
                                        <Input placeholder="Description" value={p.description} onChange={(e) => updatePoint(idx, "description", e.target.value)} />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABOUT */}
                <TabsContent value="about" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">About Page Hero</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Hero Title</Label>
                                <Input value={settings.aboutHeroTitle || ""} onChange={(e) => setSettings({ ...settings, aboutHeroTitle: e.target.value })} placeholder="Your Trusted Partner..." />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Hero Subtitle</Label>
                                <Textarea value={settings.aboutHeroSubtitle || ""} onChange={(e) => setSettings({ ...settings, aboutHeroSubtitle: e.target.value })} rows={2} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Company Story</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>First Paragraph (Story)</Label>
                                <Textarea value={settings.aboutStory || ""} onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })} rows={4} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Second Paragraph (Extra context)</Label>
                                <Textarea value={settings.aboutStoryExtra || ""} onChange={(e) => setSettings({ ...settings, aboutStoryExtra: e.target.value })} rows={4} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Founder Section</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label>Founder Name</Label>
                                        <Input value={settings.founderName || ""} onChange={(e) => setSettings({ ...settings, founderName: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Designation / Role</Label>
                                        <Input value={settings.founderTitle || ""} onChange={(e) => setSettings({ ...settings, founderTitle: e.target.value })} placeholder="CEO & Founder" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Founder's Message / Quote</Label>
                                        <Textarea value={settings.founderQuote || ""} onChange={(e) => setSettings({ ...settings, founderQuote: e.target.value })} rows={6} placeholder="At NIVAA GLOBAL, our commitment goes beyond products..." />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label>Founder Photo</Label>
                                    <ImageUpload
                                        value={settings.founderImageId || ""}
                                        onChange={(v) => setSettings({ ...settings, founderImageId: v as string })}
                                        folder="nivaaglobal/founder"
                                    />
                                    <p className="text-xs text-muted-foreground italic">Recommended size: 800x1000 pixels (Portrait).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Mission, Vision & Promise</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Mission Text</Label>
                                <Textarea value={settings.missionText || ""} onChange={(e) => setSettings({ ...settings, missionText: e.target.value })} rows={2} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Vision Text</Label>
                                <Textarea value={settings.visionText || ""} onChange={(e) => setSettings({ ...settings, visionText: e.target.value })} rows={2} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Promise Text</Label>
                                <Textarea value={settings.promiseText || ""} onChange={(e) => setSettings({ ...settings, promiseText: e.target.value })} rows={2} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTACT */}
                <TabsContent value="contact" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader><CardTitle className="font-heading text-lg">Contact Page</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Hero Title</Label>
                                <Input value={settings.contactHeroTitle || ""} onChange={(e) => setSettings({ ...settings, contactHeroTitle: e.target.value })} placeholder="Contact NIVAA GLOBAL" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Hero Subtitle</Label>
                                <Textarea value={settings.contactHeroSubtitle || ""} onChange={(e) => setSettings({ ...settings, contactHeroSubtitle: e.target.value })} rows={2} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Google Maps Embed URL</Label>
                                <Input value={settings.mapEmbedUrl || ""} onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                                    placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Business Hours</Label>
                                <Input value={settings.businessHours || ""} onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                                    placeholder="9:00 AM - 6:00 PM IST" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CERTIFICATIONS */}
                <TabsContent value="certs" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-heading text-lg">Certifications</CardTitle>
                            <Button variant="outline" size="sm" onClick={addCert}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(settings.certifications || []).map((cert, idx) => (
                                <div key={idx} className="border border-gray-100 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="Title (e.g. ISO 9001:2015)" value={cert.title} onChange={(e) => updateCert(idx, "title", e.target.value)} className="flex-1" />
                                        <select value={cert.status} onChange={(e) => updateCert(idx, "status", e.target.value)}
                                            className="h-10 px-3 rounded-md border border-input bg-background text-sm w-36">
                                            <option value="Certified">Certified</option>
                                            <option value="Active">Active</option>
                                            <option value="Compliant">Compliant</option>
                                            <option value="In Process">In Process</option>
                                        </select>
                                        <Button variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => removeCert(idx)}><X className="w-4 h-4" /></Button>
                                    </div>
                                    <Textarea placeholder="Description" value={cert.description} onChange={(e) => updateCert(idx, "description", e.target.value)} rows={2} />
                                </div>
                            ))}
                            {(!settings.certifications || settings.certifications.length === 0) && (
                                <p className="text-sm text-muted-foreground">No certifications yet. Click Add to create.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO */}
                <TabsContent value="seo" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg flex items-center gap-2">
                                <Search className="w-5 h-5 text-brand-primary" />
                                Global SEO Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Default Meta Title</Label>
                                <Input
                                    value={settings.seoTitle || ""}
                                    onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                                    placeholder="NIVAA GLOBAL | Premium Cotton Exports"
                                />
                                <p className="text-[11px] text-muted-foreground">Recommended: 50-60 characters</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Default Meta Description</Label>
                                <Textarea
                                    value={settings.seoDescription || ""}
                                    onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                                    rows={3}
                                    placeholder="Brief summary of your website for search engines..."
                                />
                                <p className="text-[11px] text-muted-foreground">Recommended: 150-160 characters</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Default Keywords (comma separated)</Label>
                                <Input
                                    value={settings.seoKeywords || ""}
                                    onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                                    placeholder="cotton export, t-shirts, denim jeans..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-brand-primary" />
                                Social Media (Open Graph)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Default Social Sharing Image (OG Image)</Label>
                                <ImageUpload
                                    value={settings.ogImageId || ""}
                                    onChange={(v) => setSettings({ ...settings, ogImageId: v as string })}
                                    folder="nivaaglobal/seo"
                                />
                                <p className="text-[11px] text-muted-foreground italic">
                                    This image is shown when you share your website link on social media.
                                    Recommended size: 1200x630 pixels.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* INQUIRY POPUP */}
                <TabsContent value="popup" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-heading text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-brand-primary" />
                                Inquiry Popup Configuration
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="showPopup" className="text-sm cursor-pointer">Enabled</Label>
                                <input
                                    type="checkbox"
                                    id="showPopup"
                                    checked={settings.showPopup || false}
                                    onChange={(e) => setSettings({ ...settings, showPopup: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-bold text-brand-accent">Popup Title</Label>
                                        <Input
                                            value={settings.popupTitle || ""}
                                            onChange={(e) => setSettings({ ...settings, popupTitle: e.target.value })}
                                            placeholder="e.g., Get a Free Export Consultation"
                                            className="rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 h-12"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-bold text-brand-accent">Popup Message</Label>
                                        <Textarea
                                            value={settings.popupMessage || ""}
                                            onChange={(e) => setSettings({ ...settings, popupMessage: e.target.value })}
                                            rows={4}
                                            placeholder="Enter the message you want to show to your visitors..."
                                            className="rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 min-h-[120px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5 opacity-80">
                                        <Label className="text-sm font-bold text-brand-accent">Inquiry Notification Email (System Restricted)</Label>
                                        <Input
                                            type="email"
                                            value="admin@nivaaglobal.com"
                                            disabled
                                            className="rounded-xl border-gray-200 bg-gray-50 cursor-not-allowed h-12"
                                        />
                                        <p className="text-[11px] text-amber-600 font-medium italic">
                                            Currently restricted to admin@nivaaglobal.com for reliable delivery.
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-bold text-brand-accent">Display Delay (milliseconds)</Label>
                                        <Input
                                            type="number"
                                            value={settings.popupDelay || 2000}
                                            onChange={(e) => setSettings({ ...settings, popupDelay: parseInt(e.target.value) })}
                                            placeholder="2000"
                                            className="rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 h-12"
                                        />
                                        <p className="text-[11px] text-muted-foreground italic">1000ms = 1 second</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold text-brand-accent">Popup Image</Label>
                                    <ImageUpload
                                        value={settings.popupImageId || ""}
                                        onChange={(v) => setSettings({ ...settings, popupImageId: v as string })}
                                        folder="nivaaglobal/popups"
                                    />
                                    <p className="text-xs text-muted-foreground italic">
                                        Recommended size: 800x600 pixels. Leave empty to show only the form.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EMAIL TEMPLATES */}
                <TabsContent value="emails" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg">Admin Notification Template</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">This email is sent to admin@nivaaglobal.com when a new inquiry arrives.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Subject Line</Label>
                                <Input
                                    value={settings.adminEmailSubject || ""}
                                    onChange={(e) => setSettings({ ...settings, adminEmailSubject: e.target.value })}
                                    placeholder="New Export Inquiry: {{name}}"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Message Body</Label>
                                <Textarea
                                    value={settings.adminEmailBody || ""}
                                    onChange={(e) => setSettings({ ...settings, adminEmailBody: e.target.value })}
                                    rows={8}
                                    placeholder="Enter email content..."
                                />
                                <p className="text-[11px] text-muted-foreground italic">Available placeholders: {"{{name}}, {{email}}, {{phone}}, {{company}}, {{productName}}, {{message}}"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg">User Auto-Reply Template</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">This email is sent to the customer immediately after they submit the form.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Subject Line</Label>
                                <Input
                                    value={settings.userEmailSubject || ""}
                                    onChange={(e) => setSettings({ ...settings, userEmailSubject: e.target.value })}
                                    placeholder="Thank you for your inquiry - NIVAA GLOBAL"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Message Body</Label>
                                <Textarea
                                    value={settings.userEmailBody || ""}
                                    onChange={(e) => setSettings({ ...settings, userEmailBody: e.target.value })}
                                    rows={8}
                                    placeholder="Enter auto-reply content..."
                                />
                                <p className="text-[11px] text-muted-foreground italic">Available placeholders: {"{{name}}, {{productName}}"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* GALLERY */}
                <TabsContent value="gallery" className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="font-heading text-lg">Product & Facility Gallery</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Manage images shown on the public Gallery page.</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-bold text-brand-accent">Gallery Images</Label>
                                <ImageUpload
                                    value={settings.galleryImageIds || []}
                                    onChange={(v) => setSettings({ ...settings, galleryImageIds: v as string[] })}
                                    multiple
                                    folder="nivaaglobal/gallery"
                                />
                                <div className="p-4 bg-brand-surface rounded-lg border border-gray-100 mt-6">
                                    <h4 className="text-sm font-bold text-brand-accent mb-2">Cloudinary Optimization Active</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        All images uploaded here are automatically processed for:
                                        <br />• <strong>Auto-Format:</strong> Delivers WebP/AVIF based on browser support.
                                        <br />• <strong>Auto-Quality:</strong> Compresses images without visible loss.
                                        <br />• <strong>Responsive Loading:</strong> Generates appropriate sizes for mobile/desktop.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
