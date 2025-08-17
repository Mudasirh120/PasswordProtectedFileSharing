import { hashPassword, comparePassword } from "../util/bcrypt.js";
import { File } from "../model/File.js";
export const uploadFile = async (req, res) => {
  try {
    const fileData = {
      path: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
    };
    if (req.body.password != null && req.body.password !== "") {
      fileData.password = await hashPassword(req.body.password);
    }
    const file = new File(fileData);
    await file.save();
    res.render("index", {
      fileLink: `${req.headers.origin}/file/download/${file.id}`,
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
  findFile.downloadCount++;
  await findFile.save();
  res.download(findFile.path, findFile.originalName);
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
  findFile.downloadCount++;
  await findFile.save();
  res.download(findFile.path, findFile.originalName);
};
