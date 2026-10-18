import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file (before compression)
    files: 9, // Max 3 photos per item * 3 items
  },
});

function isRealImage(buffer) {
  if (!buffer || buffer.length < 12) return false;
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  // WEBP (RIFF....WEBP)
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

function invalidContentError() {
  const error = new Error('Isi file bukan gambar yang valid. Hanya JPEG, PNG, dan WebP yang diizinkan.');
  error.status = 400;
  return error;
}

const baseUploadMiddleware = upload.array('photos', 9);

// After multer writes to disk, verify magic bytes (mimetype alone is spoofable).
export const uploadMiddleware = (req, res, next) => {
  baseUploadMiddleware(req, res, (err) => {
    if (err) return next(err);

    const files = req.files || [];
    for (const file of files) {
      let fd;
      try {
        fd = fs.openSync(file.path, 'r');
        const header = Buffer.alloc(12);
        fs.readSync(fd, header, 0, 12, 0);
        if (!isRealImage(header)) {
          fs.closeSync(fd);
          fs.unlinkSync(file.path);
          return next(invalidContentError());
        }
      } catch (readError) {
        return next(readError);
      } finally {
        if (fd !== undefined) {
          try { fs.closeSync(fd); } catch { /* ignore */ }
        }
      }
    }

    next();
  });
};