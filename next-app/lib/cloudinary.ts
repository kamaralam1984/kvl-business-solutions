import { v2 as cloudinary } from 'cloudinary';

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (CLOUD && KEY && SECRET) {
  cloudinary.config({ cloud_name: CLOUD, api_key: KEY, api_secret: SECRET, secure: true });
}

export const isConfigured = () => !!(CLOUD && KEY && SECRET);
export { cloudinary };

// A stable, per-user folder segment for self-service upload folders
// (kvl/tickets, kvl/users) — lets app/api/upload/delete verify a caller only
// deletes assets under their own prefix instead of any publicId they can
// guess/enumerate (kvl/products is exempt: admin-only for both upload and
// delete already, no per-user scoping needed there).
export function ownerFolderKey(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}
