import { getReciverSocketId } from "../libs/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import multer from "multer";
import Imagekit from "imagekit";

// configure middleware
const upload = multer({ storage: multer.memoryStorage() });

// initialize
let imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URLENDPOINT,
});

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  try {
    // let currentUserId = "user_30Gxu5WwUgs84XMZlCnJukdbilD";
    let currentUserId = req.auth?.userId;

    const messages = await Message.find({
      $or: [
        { fromClerkId: currentUserId, toClerkId: userToChatId },
        { fromClerkId: userToChatId, toClerkId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    console.log("Get Messages:", messages[0]?.text);
    res.status(200).json(messages);
  } catch (error) {
    console.error("error in getting message controller", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: toClerkId } = req.params;
    // const fromClerkId = "user_30Gxu5WwUgs84XMZlCnJukdbilD";
    const fromClerkId = req.auth?.userId;

    if (!fromClerkId) {
      return res.status(400).json({ error: "Unauthorized User" });
    }

    const fromUser = await User.findOne({ clerkUserId: fromClerkId });
    const toUser = await User.findOne({ clerkUserId: toClerkId });
    // handling the images convert to buffer format and upload to imagekit
    let imageUrl;
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      const result = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}`,
        useUniqueFileName: true,
      });
      console.log(result);
      imageUrl = result.url;
    }

    const newMessage = await Message.create({
      fromClerkId,
      toClerkId,
      from: fromUser._id,
      to: toUser._id,
      text,
    });

    // Socket io part
    console.log("hit");

    const reciverSocketId = getReciverSocketId(toClerkId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    const senderSocketId = getReciverSocketId(fromClerkId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("error in sending message controller ", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export { upload };
