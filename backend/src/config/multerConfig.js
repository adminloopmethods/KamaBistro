// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create uploads folder if not exists
// const uploadFolder = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder);
// }

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   // Accept only images as an example
//   const allowed = ["image/jpeg", "image/png", "image/gif"];
//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, PNG, and GIF files are allowed"), false);
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 9 * 1024 * 1024 }, // 5MB limit
// });
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