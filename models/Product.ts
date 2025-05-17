import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  images?: string[];
  description?: string;
  price: number;
  discount?: number;
  quantity: number;
  is_pack: boolean;
  created_at: Date;
  updated_at: Date;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  images: { type: [String] },
  description: String,
  price: { type: Number, required: true },
  discount: Number,
  quantity: { type: Number, required: true },
  is_pack: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
