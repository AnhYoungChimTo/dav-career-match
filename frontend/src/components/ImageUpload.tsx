"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value: string | null;
    onChange: (value: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onChange(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="avatar-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                            {preview ? "Change Photo" : "Upload Photo"}
                        </span>
                    </Button>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
                {preview && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}
