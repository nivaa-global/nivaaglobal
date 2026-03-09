"use client";

import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/firestore";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        imagePublicId: "",
        description: "",
        order: 0,
        active: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const cats = await getCategories();
            setCategories(cats);
        } catch {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }

    function openNew() {
        setEditingCategory(null);
        setForm({ name: "", slug: "", imagePublicId: "", description: "", order: categories.length, active: true });
        setShowDialog(true);
    }

    function openEdit(cat: Category) {
        setEditingCategory(cat);
        setForm({
            name: cat.name,
            slug: cat.slug,
            imagePublicId: cat.imagePublicId || "",
            description: cat.description,
            order: cat.order,
            active: cat.active,
        });
        setShowDialog(true);
    }

    async function handleSave() {
        if (!form.name || !form.slug || !form.description) {
            toast.error("Please fill in all required fields");
            return;
        }
        setSaving(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, form);
                toast.success("Category updated");
            } else {
                await createCategory(form);
                toast.success("Category created");
            }
            setShowDialog(false);
            fetchData();
        } catch {
            toast.error("Failed to save category");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this category? Products in this category will not be deleted.")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            fetchData();
        } catch {
            toast.error("Failed to delete category");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-brand-accent">Categories</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage product categories</p>
                </div>
                <Button onClick={openNew} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" />
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted-foreground">No categories yet</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {categories.map((cat) => (
                        <Card key={cat.id} className="border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-sm">{cat.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                Order: {cat.order}
                                            </Badge>
                                            <Badge
                                                variant={cat.active ? "default" : "secondary"}
                                                className={`text-xs ${cat.active ? "bg-brand-secondary text-white" : ""}`}
                                            >
                                                {cat.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            /{cat.slug} — {cat.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-heading">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Slug *</Label>
                                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Image</Label>
                            <ImageUpload
                                value={form.imagePublicId}
                                onChange={(val) => setForm({ ...form, imagePublicId: val as string })}
                                folder="nivaaglobal/categories"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description *</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    value={form.order}
                                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 text-sm">
                                    <Switch
                                        checked={form.active}
                                        onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                                    />
                                    Active
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-brand-primary hover:bg-brand-primary-dark text-white"
                        >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
