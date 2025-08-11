import {Router} from "express";
import MediaController from "./media.controller.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import multer from "multer";
import mediaUploader from "../../helper/mediaUploader.js";
const router = Router();
const upload = multer({dest: "uploads/"}); // temporary folder

router.post(
  "/upload",
  upload.array("mediaFile"), // Changed from 'images' to 'mediaFile' to match Postman
  mediaUploader,
  tryCatchWrap(MediaController.UploadMedia)
);

router.get("/getMedia", tryCatchWrap(MediaController.GetMedia));

router.delete("/delete/:id", tryCatchWrap(MediaController.DeleteMedia));

export default router;
