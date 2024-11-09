"use client"

import { useState, useEffect } from "react";
import { updatePhoto } from "@/actions/cloudinary";
import { FidgetSpinner } from "react-loader-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchUser } from "@/utils/useFetchUser";
import path from "path";
import { CloudinaryUploadResult } from "@/types";

const UPLOAD_CROPPED_PICTURE_URL = "/api/cropped/upload";

interface UploadAvatarPictureProps {
    onUploadComplete?: (result: CloudinaryUploadResult | null, error: string | null) => void;
}

export default function UploadAvatarPicture({ onUploadComplete }: UploadAvatarPictureProps) {
    const { data, role, isLoading } = useFetchUser();
    const defaultAvatar = 'images/def-avatar.svg';
    const [isUploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<CloudinaryUploadResult | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedAvatar, setUploadedAvatar] = useState(defaultAvatar);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setUserId(data.school_id);
        }
    }, [data]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (!userId) {
            setError("User ID is missing.");
            return; // Prevent submission if userId is null
        }

        setUploading(true);
        try {
            const result = await updatePhoto(formData, userId);

            if (!result || !result.secure_url) {
                const errMsg = "Failed to upload photo";
                setError(errMsg);
                if (onUploadComplete) onUploadComplete(null, errMsg);
                return;
            }

            // Extract the filename from the secure_url
            const fileName = path.basename(result.secure_url);

            const response = await fetch(UPLOAD_CROPPED_PICTURE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cropped_image_url: result.secure_url,
                    fileName: fileName,
                    userId: userId,
                }),
            });

            if (response.ok) {
                const successMsg = "Uploading Avatar success";
                setSuccess(successMsg);
                setUploadResult(result);
                setUploadedAvatar(result.secure_url);
                if (onUploadComplete) onUploadComplete(result, null);
            } else {
                const errMsg = "Failed to save image URL to database";
                setError(errMsg);
                if (onUploadComplete) onUploadComplete(null, errMsg);
            }
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "Unknown error";
            setError("Upload failed: " + errMsg);
            if (onUploadComplete) onUploadComplete(null, errMsg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Avatar className="w-24 h-24">
                <AvatarImage src={uploadedAvatar} alt="Avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Choose file/Take a selfie and Click Upload to unlock NEXT
            </span>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!success && !error && <p>Select a file to upload</p>}
            <form onSubmit={handleSubmit}>
                <input type="file" name="profile-image" />
                <div className="relative text-right">
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#d81989] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <FidgetSpinner
                                    visible={true}
                                    height="20"
                                    width="20"
                                    ariaLabel="loading"
                                    wrapperStyle={{ display: "inline-block", marginRight: "8px" }}
                                    ballColors={["#ff0000", "#00ff00", "#0000ff"]}
                                />
                                Uploading...
                            </>
                        ) : (
                            "Upload Image"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
