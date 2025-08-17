import mongoose from "mongoose";
const fileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    password: String,
    expiresAt: { type: Date, default: Date.now() + 30 * 60 * 1000 },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);
export const File = mongoose.model("File", fileSchema);
