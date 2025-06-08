import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  full_name: string;
  mobile: string;
  email?: string;
  password: string;
  role: string;
  birthday?: Date;
  wholesaler?: boolean
}

const UserSchema = new mongoose.Schema<IUser>({
  full_name: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: false },
  role: { type: String, default: "user" },
  wholesaler: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema, "users");
