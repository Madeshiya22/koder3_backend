import multer from "multer";

const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype.startsWith("image/") ||
//     file.mimetype.startsWith("video/")
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images and videos allowed "), false);
//   }
// };

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 7 // max 7 files
  },
  // fileFilter
});

export default upload;