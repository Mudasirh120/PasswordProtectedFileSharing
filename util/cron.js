import cron from "node-cron";
import fs from "fs";
import path from "path";
import { File } from "../model/File.js";
cron.schedule("0 * * * *", async () => {
  console.log("Checking for expired files...");
  try {
    const expiredFiles = await File.find({ expiresAt: { $lt: new Date() } });
    for (const file of expiredFiles) {
      const filePath = path.join(process.cwd(), file.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", filePath, err);
        else console.log("Deleted file:", filePath);
      });
      await File.deleteOne({ _id: file._id });
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
export default cron;
