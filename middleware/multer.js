import multer from "multer";
import path from "path";
import fs from "fs";
const Dir = "/tmp/uploads";
fs.mkdirSync(Dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp/uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "text/plain",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  },
});
export default upload;
