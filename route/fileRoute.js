import e from "express";
import upload from "../middleware/multer.js";
import {
  downloadProtectedFile,
  downloadUnprotectedFile,
  uploadFile,
} from "../controllers/fileController.js";
const fileRouter = e.Router();
fileRouter.post(
  "/upload",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.render("index", { errorMsg: err.message, fileLink: null });
      }
      next();
    });
  },
  uploadFile
);
fileRouter.get("/download/:id", downloadUnprotectedFile);
fileRouter.post("/download/:id", downloadProtectedFile);
export default fileRouter;
