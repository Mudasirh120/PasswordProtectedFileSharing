import multer from "multer";
import path from "path";
import fs from "fs";
const Dir = "uploads";
if (!fs.existsSync(Dir)) {
  fs.mkdirSync(Dir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
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
    const allowed = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  },
});
// const upload = multer({ storage: storage });
export default upload;
