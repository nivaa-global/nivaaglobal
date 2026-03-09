"use client";

import Image from "next/image";
import { useState } from "react";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface CloudinaryImageProps {
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    sizes?: string;
    priority?: boolean;
    crop?: string;
}

export function CloudinaryImage({
    publicId,
    alt,
    width = 800,
    height = 600,
    className = "",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = false,
    crop = "fill",
}: CloudinaryImageProps) {
    if (!publicId) {
        return (
            <div
                className={`bg-gray-100 flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <span className="text-gray-400 text-sm">No image</span>
            </div>
        );
    }

    return (
        <Image
            src={getCloudinaryUrl(publicId, { width, height, crop })}
            alt={alt}
            width={width}
            height={height}
            className={className}
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
        />
    );
}

interface ImageGalleryProps {
    publicIds: string[];
    alt: string;
}

export function ImageGallery({ publicIds, alt }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!publicIds || publicIds.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
            </div>
        );
    }

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? publicIds.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === publicIds.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div className="space-y-3">
                {/* Main Image */}
                <div
                    className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Image
                        src={getCloudinaryUrl(publicIds[selectedIndex], {
                            width: 800,
                            height: 800,
                            crop: "fill",
                        })}
                        alt={`${alt} - Image ${selectedIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Navigation arrows */}
                    {publicIds.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {publicIds.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {publicIds.map((id, idx) => (
                            <button
                                key={id}
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${idx === selectedIndex
                                        ? "border-brand-primary shadow-md"
                                        : "border-transparent hover:border-gray-300"
                                    }`}
                            >
                                <Image
                                    src={getCloudinaryUrl(id, { width: 100, height: 100, crop: "fill" })}
                                    alt={`${alt} thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={getCloudinaryUrl(publicIds[selectedIndex], {
                                width: 1200,
                                height: 1200,
                                crop: "fit",
                            })}
                            alt={`${alt} - Full size`}
                            width={1200}
                            height={1200}
                            className="object-contain max-h-[80vh] w-auto mx-auto"
                        />

                        {publicIds.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                        {selectedIndex + 1} / {publicIds.length}
                    </div>
                </div>
            )}
        </>
    );
}
