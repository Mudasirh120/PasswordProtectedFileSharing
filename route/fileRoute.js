import e from "express";
import upload from "../middleware/multer.js";
import {
  downloadProtectedFile,
  downloadUnprotectedFile,
  uploadFile,
} from "../controllers/fileController.js";
const fileRouter = e.Router();
fileRouter.post("/upload", upload.single("file"), uploadFile);
fileRouter.get("/download/:id", downloadUnprotectedFile);
fileRouter.post("/download/:id", downloadProtectedFile);
export default fileRouter;
