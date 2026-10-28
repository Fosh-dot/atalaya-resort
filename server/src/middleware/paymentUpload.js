import multer from "multer";
import { randomUUID } from "node:crypto";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);

const paymentUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const extension = file.originalname
      .slice(file.originalname.lastIndexOf("."))
      .toLowerCase();

    if (
      !allowedMimeTypes.has(file.mimetype) ||
      !allowedExtensions.has(extension)
    ) {
      return callback(
        new Error("Only JPEG, PNG, WebP, and PDF receipts are allowed."),
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export { randomUUID };
export default paymentUpload;
