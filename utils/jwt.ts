import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user: { id: string; role: string }): string => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1000h" });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
