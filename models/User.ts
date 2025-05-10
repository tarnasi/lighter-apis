import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  role: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema, "users");
