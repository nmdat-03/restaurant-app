"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { X } from "lucide-react";
import { useCloudinaryCleanup } from "@/hooks/useCloudinaryCleanup";

type ImageType = {
    url: string;
    publicId?: string;
};

export default function UploadImages({
    images,
    onChange,
    multiple = true,
    max = 5,
    onCleanupReady,
}: {
    images: ImageType[];
    onChange: (images: ImageType[]) => void;
    multiple?: boolean;
    max?: number;
    onCleanupReady?: (clear: () => void) => void;
}) {
    const [uploading, setUploading] = useState(false);

    const { add, remove, clear } = useCloudinaryCleanup();

    useEffect(() => {
        onCleanupReady?.(clear);
    }, [clear, onCleanupReady]);

    const handleSuccess = (result: any) => {
        setUploading(false);

        const info = result?.info;
        if (!info?.secure_url) return;

        const newImage: ImageType = {
            url: info.secure_url,
            publicId: info.public_id,
        };

        if (info.public_id) {
            add(info.public_id);
        }

        if (multiple) {
            if (images.length >= max) return;
            onChange([...images, newImage]);
        } else {
            onChange([newImage]);
        }
    };

    const handleRemove = async (index: number) => {
        const img = images[index];

        if (img.publicId) {
            await fetch("/api/cloudinary/delete", {
                method: "POST",
                body: JSON.stringify({ publicId: img.publicId }),
            });

            remove(img.publicId);
        }

        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-3">
            {/* Upload button */}
            <CldUploadWidget
                uploadPreset="e-commerce"
                onUpload={() => setUploading(true)}
                onSuccess={handleSuccess}
                onError={() => {
                    setUploading(false);
                    alert("Upload failed");
                }}
            >
                {({ open }: { open: () => void }) => (
                    <button
                        type="button"
                        disabled={uploading || (multiple && images.length >= max)}
                        onClick={() => open()}
                        className="px-4 py-2 bg-gray-200 text-sm text-gray-600 rounded-md disabled:opacity-50"
                    >
                        {uploading
                            ? "Uploading..."
                            : multiple
                                ? `+ Upload (${images.length}/${max})`
                                : images.length > 0
                                    ? "Change image"
                                    : "+ Upload image"}
                    </button>
                )}
            </CldUploadWidget>

            {/* Preview */}
            <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                    <div key={i} className="relative group">
                        <img
                            src={img.url}
                            className="w-full h-24 object-cover rounded-xl border"
                        />

                        {/* Delete button */}
                        <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}