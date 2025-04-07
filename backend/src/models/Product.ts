import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  seller: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  negotiable: boolean;
  imageUrl: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
