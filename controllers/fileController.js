import { hashPassword, comparePassword } from "../util/bcrypt.js";
import { File } from "../model/FileModel.js";
import { cloudinaryUpload } from "../util/cloudinary.js";
import axios from "axios";
export const uploadFile = async (req, res) => {
  try {
    const cloudinaryRes = await cloudinaryUpload(
      req.file.path,
      req.file.mimetype.split("/")[0]
    );
    const fileData = {
      path: cloudinaryRes.url,
      originalName: req.file.originalname,
      size: req.file.size,
      publicId: cloudinaryRes.publicId,
    };
    if (req.body.password != null && req.body.password !== "") {
      fileData.password = await hashPassword(req.body.password);
    }
    const file = new File(fileData);
    await file.save();
    res.render("index", {
      fileLink: `${req.headers.origin}/file/download/${file.id}`,
      errorMsg: null,
    });
  } catch (error) {
    console.log(error);
  }
};
export const downloadUnprotectedFile = async (req, res) => {
  const findFile = await File.findById(req.params.id);
  if (!findFile) {
    return res
      .status(404)
      .render("errorfile", { errorCode: 404, errorMessage: "File not found" });
  }
  if (findFile.expiresAt <= Date.now()) {
    res
      .status(400)
      .render("errorfile", { errorCode: 400, errorMessage: "File expired" });
  }
  if (findFile.password) {
    res.render("password", { id: findFile._id });
    return;
  }
  await downloadFile(res, findFile);
  res.render("index", { fileLink: null, errorMsg: null });
  // res.download(findFile.path, findFile.originalName);
};
export const downloadProtectedFile = async (req, res) => {
  const findFile = await File.findById(req.params.id);
  if (!findFile) {
    res
      .status(404)
      .render("errorfile", { errorCode: 404, errorMessage: "File Not Found" });
  }
  if (findFile.expiresAt <= Date.now()) {
    res
      .status(400)
      .render("errorfile", { errorCode: 400, errorMessage: "File Expired" });
  }
  const match = await comparePassword(req.body.password, findFile.password);
  if (!match) {
    res.render("password", { error: true, id: findFile.id });
    return;
  }
  await downloadFile(res, findFile);
  // res.download(findFile.path, findFile.originalName);
  res.render("index", { fileLink: null, errorMsg: null });
};

const downloadFile = async (res, file) => {
  try {
    const response = await axios({
      url: file.path,
      method: "GET",
      responseType: "stream",
    });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
  }
};
