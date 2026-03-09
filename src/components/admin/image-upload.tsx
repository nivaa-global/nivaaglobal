"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    folder?: string;
}

export function ImageUpload({
    value,
    onChange,
    multiple = false,
    folder = "nivaaglobal",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setUploading(true);
            try {
                // Get signature
                const sigResponse = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder }),
                });
                const sigData = await sigResponse.json();

                const uploadedIds: string[] = [];

                for (const file of Array.from(files)) {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("api_key", sigData.apiKey);
                    formData.append("timestamp", sigData.timestamp.toString());
                    formData.append("signature", sigData.signature);
                    formData.append("folder", sigData.folder);

                    const uploadResponse = await fetch(
                        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
                        { method: "POST", body: formData }
                    );

                    const uploadData = await uploadResponse.json();
                    if (uploadData.public_id) {
                        uploadedIds.push(uploadData.public_id);
                    }
                }

                if (multiple) {
                    const currentIds = Array.isArray(value) ? value : [];
                    onChange([...currentIds, ...uploadedIds]);
                } else {
                    onChange(uploadedIds[0] || "");
                }

                toast.success(`${uploadedIds.length} image(s) uploaded`);
            } catch (error) {
                toast.error("Upload failed. Please try again.");
                console.error("Upload error:", error);
            } finally {
                setUploading(false);
                e.target.value = "";
            }
        },
        [value, onChange, multiple, folder]
    );

    const handleRemove = (publicId: string) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((id) => id !== publicId));
        } else {
            onChange(multiple ? [] : "");
        }
    };

    const images = multiple
        ? Array.isArray(value)
            ? value
            : []
        : typeof value === "string" && value
            ? [value]
            : [];

    return (
        <div className="space-y-3">
            {/* Preview */}
            {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {images.map((publicId) => (
                        <div
                            key={publicId}
                            className="relative w-24 h-24 rounded-lg overflow-hidden border group"
                        >
                            <Image
                                src={getCloudinaryUrl(publicId, {
                                    width: 200,
                                    height: 200,
                                    crop: "fill",
                                })}
                                alt="Uploaded image"
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(publicId)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            <label className="cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:border-brand-primary hover:text-brand-primary transition-colors">
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <ImagePlus className="w-4 h-4" />
                            {multiple ? "Add Images" : "Upload Image"}
                        </>
                    )}
                </div>
            </label>
        </div>
    );
}
