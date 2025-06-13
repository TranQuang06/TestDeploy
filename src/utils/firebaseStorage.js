import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

// Upload single image
export const uploadImage = async (imageFile, userId, folder = "posts") => {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${imageFile.name}`;
  const imagePath = `${folder}/${userId}/${fileName}`;
  const imageRef = ref(storage, imagePath);

  const snapshot = await uploadBytes(imageRef, imageFile);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

// Upload multiple images
export const uploadMultipleImages = async (
  imageFiles,
  userId,
  folder = "posts"
) => {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  const uploadPromises = imageFiles.map((file) =>
    uploadImage(file, userId, folder)
  );
  const downloadURLs = await Promise.all(uploadPromises);

  return downloadURLs;
};

// Validate image file
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Image size must be less than ${maxSizeMB}MB`);
  }

  const supportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!supportedFormats.includes(file.type)) {
    throw new Error("Unsupported image format");
  }

  return true;
};
