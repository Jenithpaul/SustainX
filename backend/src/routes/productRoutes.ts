import express from "express";
import { uploadProduct, getProducts, deleteProduct } from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import upload from "../utils/cloudinary";
const router = express.Router();

router.post("/upload", protect, uploadProduct);
router.get("/", getProducts);
router.delete("/:productId", protect, deleteProduct);
router.post("/upload-image", upload.single("image"), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file?.filename}` });
  });

export default router;
