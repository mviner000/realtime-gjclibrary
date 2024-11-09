"use server";
import { v2 as cloud, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { env } from "@/env";
import streamifier from "streamifier";

cloud.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY,
  api_secret: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET,
  secure: true,
});

const uploadFileToCloud = async (
  file: File,
  options?: UploadApiOptions
): Promise<UploadApiResponse | undefined> => {
  if (file.size <= 0) return;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloud.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error.message);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const updatePhoto = async (formData: FormData, userId: string) => {
  const file = formData.get("profile-image");
  if (file instanceof File) {
    try {
      const result = await uploadFileToCloud(file, {
        folder: `user_uploads/${userId}`,
        width: 300,
        height: 300,
        gravity: "face",
        crop: "fill",
      });
      return result;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  }
};
