import { Request, Response } from "express";
import Product from "../models/Product";


export const uploadProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, price, negotiable, imageUrl } = req.body;
    const seller = req.user?.id;  // Ensure authentication middleware

    const newProduct = await Product.create({
      seller,
      title,
      description,
      category,
      price,
      negotiable,
      imageUrl,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find().populate("seller", "firstName lastName email");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  };

  export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  };
  