import { Icon } from "@iconify/react";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";

function ImageUpload({
    label,
    onFileChange,
    error,
    required = false,
    existingImageUrl
}: {
    label: string;
    onFileChange: (file: File | null) => void;
    error?: string;
    required?: boolean;
    existingImageUrl?: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(existingImageUrl || "");
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (existingImageUrl) {
            setPreview(existingImageUrl);
        }
    }, [existingImageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            setUploading(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreview(result);
                setUploading(false);
            };
            reader.readAsDataURL(file);

            setSelectedFile(file);
            onFileChange(file);
        }
    };

    const clearImage = () => {
        setPreview("");
        setSelectedFile(null);
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-white font-medium">
                {label} {required && <span className="text-red-400">*</span>}
            </label>

            {/* Image Preview */}
            {preview && (
                <div className="relative w-full max-w-md mx-auto">
                    <img
                        src={preview}
                        alt="Certificate preview"
                        className="w-full h-48 object-cover  border border-white/20"
                        onError={() => setPreview("")}
                    />
                    <div
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full cursor-pointer transition-colors"
                    >
                        <Icon icon="material-symbols:close" className="text-white text-sm" />
                    </div>
                </div>
            )}

            {/* File Upload Button */}
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="imageUpload"
                />
                <div onClick={() => fileInputRef.current?.click()}>
                    <Button
                        bg="bg-blue-500/20"
                        color="text-blue-400"
                        className="w-full justify-center"
                        disabled={uploading}
                    >
                        <Icon icon="material-symbols:upload" />
                        {uploading ? "Processing..." : (selectedFile || existingImageUrl ? "Change Image" : "Upload Image")}
                    </Button>
                </div>
            </div>

            {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
    );
}

export default ImageUpload;