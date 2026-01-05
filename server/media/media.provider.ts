import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { MediaFolder } from "./media.types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const BASE_FOLDER = "surprez";

export async function uploadToCloudinary(
  file: Buffer,
  options?: {
    folder?: MediaFolder;
    publicId?: string;
  }
) {
  const folder = options?.folder
    ? `${BASE_FOLDER}/${options.folder}`
    : BASE_FOLDER;

  return new Promise<{
    url: string;
    publicId: string;
    resourceType: "image" | "video";
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: options?.publicId,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type as "image" | "video",
          });
        }
      )
      .end(file);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
