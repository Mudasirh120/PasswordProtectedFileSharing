import cron from "node-cron";
import { File } from "../model/FileModel.js";
import { cloudinaryDelete } from "./cloudinary.js";
cron.schedule("0 * * * *", async () => {
  await cleanup();
});
export const cleanup = async () => {
  console.log("Checking for expired files...");
  try {
    const expiredFiles = await File.find({ expiresAt: { $lt: new Date() } });
    for (const file of expiredFiles) {
      await cloudinaryDelete(file.publicId);
      await File.deleteOne({ _id: file._id });
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
};
export default cron;
