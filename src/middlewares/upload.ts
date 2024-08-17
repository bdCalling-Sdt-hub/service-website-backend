import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import error from "../utils/error";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_FOLDER || "public";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 20971520; // 20 MB
const allowedFileTypes = ["jpg", "jpeg", "png"];
 
const storage: StorageEngine = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const extName = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname.replace(
      extName,
      ""
    )}${extName}`;

    req.body.image = fileName; 

    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const extName = path.extname(file.originalname).toLowerCase();
  const isAllowedFileType = allowedFileTypes.includes(extName.substring(1));
  if (!isAllowedFileType) {
    return cb(
      error(`Only ${allowedFileTypes.join(", ")} files are allowed`, 400)
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
