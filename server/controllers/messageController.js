import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { Messages } from "../models/Messages.js";
import CustomError from "../utils/utilityClasses.js";

export const createMessage = asyncErrorHandler(async (req, res, next) => {
  const { name, email, message } = req.body;

  const newMessage = Messages({ name, email, message });

  await newMessage.save();

  res.status(201).json({
    success: true,
    message: "Message successfully sent",
    feedbackMessage: newMessage,
  });
});

export const getAllMessages = asyncErrorHandler(async (req, res, next) => {
  const messages = await Messages.find({});

  res.status(200).json({
    success: true,
    feedbackMessage: messages,
  });
});

export const replyMessage = asyncErrorHandler(async (req, res, next) => {
  const reqMessage = await Messages.findById(req.params.messageId);

  if (!reqMessage) {
    return new CustomError(
      `No message found with id: ${req.params.messageid}`,
      404
    );
  }

  const { reply } = req.body;

  reqMessage.replied = true;
  reqMessage.reply = reply;
  reqMessage.repliedOn = Date.now();

  await reqMessage.save();

  res.status(200).json({
    success: true,
    message: "Reply to message successfully sent",
    feedbackMessage: reqMessage,
  });
});
