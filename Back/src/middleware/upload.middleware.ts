import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// 🧠 Almacenamiento en memoria (para Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Máx 5MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Solo imágenes JPG, PNG o WebP'));
  }
});

export default upload;
