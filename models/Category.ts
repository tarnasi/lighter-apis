import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, default: "/no-image.png" },
  description: String,
});

export default mongoose.model<ICategory>("Category", CategorySchema, "categories");
