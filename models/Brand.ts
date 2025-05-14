import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  category: mongoose.Types.ObjectId;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, default: "/no-image.png" },
  description: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
