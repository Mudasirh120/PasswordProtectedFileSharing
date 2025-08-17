import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const cloudinaryUpload = async (imagePath, folder) => {
  try {
    const res = await cloudinary.uploader.upload(imagePath, {
      folder: `fileShare/${folder}`,
      use_filename: false,
      resource_type: "auto",
    });
    console.log("Image Uploaded successfully");
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting file:", imagePath, err);
      else console.log("Deleted file:", imagePath);
    });
    return { publicId: res.public_id, url: res.secure_url };
  } catch (error) {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting file:", imagePath, err);
      else console.log("Deleted file:", imagePath);
    });
    console.log("File => ", error);
    return null;
  }
};
const cloudinaryDelete = async (publicId) => {
  try {
    const cloudinaryRes = await cloudinary.uploader.destroy(publicId);
    console.log(cloudinaryRes);
  } catch (error) {
    console.log("Error deleting file from Cloudinary:", error);
    return null;
  }
};
export { cloudinaryUpload, cloudinaryDelete };
