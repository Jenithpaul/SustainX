import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});

const upload = multer({ storage });

export default upload;
