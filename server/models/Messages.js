import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  replied: {
    type: Boolean,
    default: false,
  },
  reply: {
    type: String,
  },
  contactedOn: {
    type: Date,
    default: Date.now,
  },
  repliedOn: {
    type: String,
  },
});

export const Messages = mongoose.model("Messages", messagesSchema);
