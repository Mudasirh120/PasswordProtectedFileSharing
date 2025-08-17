import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { connectDb } from "./config/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fileRouter from "./route/fileRoute.js";
import connectCloudinary from "./config/cloudinaryConfig.js";
import cron, { cleanup } from "./util/cron.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/file", fileRouter);
app.get("/", (req, res) => {
  res.render("index", { fileLink: null, errorMsg: null });
  try {
    cleanup();
  } catch (error) {
    console.log(error);
  }
});
connectDb();
connectCloudinary();
export default app;
