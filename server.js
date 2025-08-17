import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fileRouter from "./route/fileRoute.js";
import { connectDb } from "./config/db.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/file", fileRouter);
app.get("/", (req, res) => {
  res.render("index");
});
connectDb();
export default app;
