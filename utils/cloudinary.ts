import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'blog',
      resource_type: 'auto',
      quality: 'auto:best', // High resolution
      fetch_format: 'auto', // Best format
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};


export const deleteImage = async (publicId: string) => {
  try {
    if (!publicId?.trim()) {
      return { result: 'skipped', message: 'Empty publicId' };
    }

    // Preserve the exact format including spaces
    const exactPublicId = publicId.trim();

    // Verify the resource exists first
    try {
      const resource = await cloudinary.api.resource(exactPublicId, {
        resource_type: 'image',
        type: 'upload'
      });
      console.log('Resource verified:', resource);
    } catch (error) {
      console.warn('Resource not found, skipping deletion:', exactPublicId);
      return { result: 'not_found', publicId: exactPublicId };
    }

    // Perform deletion
    const result = await cloudinary.uploader.destroy(exactPublicId, {
      invalidate: true,
      resource_type: 'image',
      type: 'upload'
    });

    return result;
  } catch (error: any) {
    console.error('Deletion error:', {
      publicId,
      error: error.message,
      response: error.response?.body
    });
    return { result: 'error', error: error.message };
  }
};