import { v2 as cloudinary } from 'cloudinary';

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (CLOUD && KEY && SECRET) {
  cloudinary.config({ cloud_name: CLOUD, api_key: KEY, api_secret: SECRET, secure: true });
}

export const isConfigured = () => !!(CLOUD && KEY && SECRET);
export { cloudinary };
