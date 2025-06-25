import cloudinary from '../config/cloudinary.config';
import fs from 'fs';

interface UploadOptions {
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
  folder?: string;
}

export const uploadToCloudinary = async (
  filePath: string,
  options: UploadOptions = {},
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      ...options,
    });

    // console.log(result);

    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error('Error while uploading to cloudinary', error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Error while uploading to cloudinary');
  }
};
