// // src/config/multerConfig.js
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import {fileURLToPath} from "url";

// // ─── Fix for __dirname in ES module ─────────────────────────────────────────────
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // ────────────────────────────────────────────────────────────────────────────────

// // 1. Define where PDFs should live
// const uploadDir = path.join(__dirname, "uploads", "pdfs");

// // Make sure the folder exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, {recursive: true});
// }

// // 2. Storage settings: put PDF files into uploadDir, name them <originalName>-<timestamp>.pdf
// const pdfStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const nameWithoutExt = path.parse(file.originalname).name;
//     const timestamp = Date.now();
//     cb(null, `${nameWithoutExt}-${timestamp}.pdf`);
//   },
// });

// // 3. Only allow “application/pdf”
// const pdfFileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed as referenceDoc"), false);
//   }
// };

// // 4. Export a single Multer instance
// export const uploadPdf = multer({
//   storage: pdfStorage,
//   fileFilter: pdfFileFilter,
//   limits: {fileSize: 10 * 1024 * 1024}, // 10 MB max
// });

// src/helper/pdfMover.js
import fs from "fs";
import path from "path";

export default async function pdfMover(req, res, next) {
  try {
    // 1. Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({error: "No file provided"});
    }

    // 2. Check MIME type
    if (req.file.mimetype !== "application/pdf") {
      // Not a PDF → remove the temp file, return 400
      fs.unlinkSync(req.file.path);
      return res.status(400).json({error: "Only PDF files are allowed"});
    }

    // 3. Create uploads/pdfs folder if it doesn’t exist
    const pdfDir = path.join("uploads", "pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, {recursive: true});
    }

    // 4. Determine a final filename. For example:
    const originalName = path.parse(req.file.originalname).name;
    const timestamp = Date.now();
    const finalFilename = `${originalName}-${timestamp}.pdf`;
    const finalPath = path.join(pdfDir, finalFilename);

    // 5. Move (rename) the temp file into uploads/pdfs
    fs.renameSync(req.file.path, finalPath);

    // 6. Expose the public‐facing path so downstream code can set referenceDoc
    //    (Assume your static server will serve "/uploads/pdfs/<filename>")
    req.uploadedPdfPath = `uploads/pdfs/${finalFilename}`;

    next();
  } catch (err) {
    console.error("pdfMover error:", err);
    return res
      .status(500)
      .json({error: "PDF upload failed", details: err.message});
  }
}
