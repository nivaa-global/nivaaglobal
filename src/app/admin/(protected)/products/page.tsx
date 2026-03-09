"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct, createProduct } from "@/lib/firestore";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, Package, Search, Loader2, Star, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [form, setForm] = useState({
        name: "", slug: "", 
        imagePublicIds: [] as string[],
        fabric: "", gsm: "", sizes: "", colors: "",
        moq: "", price: "", priceUnit: "per piece",
        description: "", shortDescription: "", specifications: "",
        featured: false, active: true,
    });

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            const prods = await getProducts();
            setProducts(prods || []);
        } catch { toast.error("Failed to load data"); }
        finally { setLoading(false); }
    }

    function openNew() {
        setEditingProduct(null);
        setForm({
            name: "", slug: "",
            imagePublicIds: [], fabric: "", gsm: "", sizes: "", colors: "",
            moq: "", price: "", priceUnit: "per piece",
            description: "", shortDescription: "", specifications: "",
            featured: false, active: true,
        });
        setShowDialog(true);
    }

    function openEdit(product: Product) {
        setEditingProduct(product);
        setForm({
            name: product.name, slug: product.slug, 
            imagePublicIds: product.imagePublicIds || [],
            fabric: product.fabric || "", gsm: product.gsm || "",
            sizes: product.sizes?.join(", ") || "",
            colors: product.colors?.join(", ") || "",
            moq: product.moq || "",
            price: product.price || "", priceUnit: product.priceUnit || "per piece",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            specifications: product.specifications
                ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join("\n")
                : "",
            featured: product.featured, active: product.active,
        });
        setShowDialog(true);
    }

    async function handleSave() {
        if (!form.name || !form.slug) {
            toast.error("Please fill in name and slug");
            return;
        }
        setSaving(true);
        try {
            const specs: Record<string, string> = {};
            if (form.specifications) {
                form.specifications.split("\n").forEach((line) => {
                    const [key, ...vals] = line.split(":");
                    if (key && vals.length > 0) specs[key.trim()] = vals.join(":").trim();
                });
            }
            const data = {
                name: form.name, slug: form.slug, 
                imagePublicIds: form.imagePublicIds,
                fabric: form.fabric, gsm: form.gsm,
                sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
                moq: form.moq, price: form.price, priceUnit: form.priceUnit,
                description: form.description, shortDescription: form.shortDescription,
                specifications: specs,
                featured: form.featured, active: form.active,
            };
            if (editingProduct) {
                await updateProduct(editingProduct.id, data);
                toast.success("Product updated");
            } else {
                await createProduct(data);
                toast.success("Product created");
            }
            setShowDialog(false);
            fetchData();
        } catch { toast.error("Failed to save product"); }
        finally { setSaving(false); }
    }

    async function handleDelete() {
        if (!deleteConfirmId) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteConfirmId);
            toast.success("Product deleted successfully");
            setDeleteConfirmId(null);
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete product");
        } finally {
            setDeleting(false);
        }
    }

    const filteredProducts = products.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.fabric?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-brand-accent">Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
                </div>
                <Button onClick={openNew} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-muted-foreground">No products found</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="border border-gray-100 shadow-sm rounded-xl">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                            {product.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                                            <Badge
                                                variant={product.active ? "default" : "secondary"}
                                                className={`text-[11px] ${product.active ? "bg-brand-primary text-white" : ""}`}
                                            >
                                                {product.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {product.fabric || "—"} · MOQ: {product.moq || "—"}
                                            {product.price && <> · <span className="text-brand-primary font-medium">${product.price}</span></>}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Switch checked={product.active} onCheckedChange={async () => {
                                            try { await updateProduct(product.id, { active: !product.active }); fetchData(); }
                                            catch { toast.error("Failed"); }
                                        }} />
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil className="w-4 h-4" /></Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => setDeleteConfirmId(product.id)}
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

            {/* Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-heading">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Name *</Label>
                                <Input value={form.name} onChange={(e) => setForm({
                                    ...form, name: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                                })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Slug *</Label>
                                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                            </div>
                        </div>



                        <div className="space-y-1.5">
                            <Label>Images</Label>
                            <ImageUpload value={form.imagePublicIds}
                                onChange={(v) => setForm({ ...form, imagePublicIds: v as string[] })} multiple folder="nivaaglobal/products" />
                        </div>

                        {/* Price row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Price (USD)</Label>
                                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g., 3.50" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Price Unit</Label>
                                <select value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                    <option value="per piece">Per Piece</option>
                                    <option value="per dozen">Per Dozen</option>
                                    <option value="per kg">Per KG</option>
                                    <option value="per meter">Per Meter</option>
                                    <option value="per set">Per Set</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>MOQ</Label>
                                <Input value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} placeholder="500 pcs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Fabric</Label>
                                <Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="100% Cotton" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>GSM</Label>
                                <Input value={form.gsm} onChange={(e) => setForm({ ...form, gsm: e.target.value })} placeholder="180" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Sizes (comma-separated)</Label>
                                <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL, XXL" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Colors (comma-separated)</Label>
                                <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="White, Black, Navy" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Short Description (for product cards)</Label>
                            <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                                placeholder="Brief one-liner for product listings" maxLength={300} />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Full Description</Label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Specifications (key: value, one per line)</Label>
                            <Textarea value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} rows={3}
                                placeholder={"Color: White\nPattern: Solid\nCollar: Round Neck"} />
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm">
                                <Switch checked={form.featured} onCheckedChange={(c) => setForm({ ...form, featured: c })} /> Featured
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <Switch checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c })} /> Active
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingProduct ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
