import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  mobile: string;
  email?: string;
  password: string;
  role: string;
  birthday?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: false },
  role: { type: String, default: "admin" },
});

export default mongoose.model<IUser>("User", UserSchema, "users");
