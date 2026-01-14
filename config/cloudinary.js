import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBase64ImageToCloudinary(base64Image) {
  if (!base64Image || typeof base64Image !== 'string') {
    throw new Error('Base64 image is required');
  }

  const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);

  if (!match) {
    throw new Error('Invalid base64 image format');
  }

  const mimeType = match[1];
  const base64Data = match[2];

  const buffer = Buffer.from(base64Data, 'base64');

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'ai-inputs',
        resource_type: 'image',
        format: mimeType.split('/')[1],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (!result?.secure_url) {
          reject(new Error('Cloudinary did not return a public URL'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
}

