// models/ticket.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  sender: "user" | "admin";
  message: string;
  created_at: Date;
}

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  subject: string;
  status: "pending" | "answered" | "closed";
  messages: IMessage[];
  created_at: Date;
  updated_at: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: String, enum: ["user", "admin"], required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema);
