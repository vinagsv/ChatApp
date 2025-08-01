import { getReciverSocketId, io } from "../libs/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import multer from "multer";
import Imagekit from "imagekit";

//Configure middleware
const upload = multer({ storage: multer.memoryStorage() });

//Intialize Imagekit
let imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  try {
    // let currentUserId = "user_30GxtqCO3idGv0XV9m6T8OIXxE4";
    let currentUserId = req.auth?.userId;
    //Find the messages based on the fromclerkId to toClerkId
    const messages = await Message.find({
      $or: [
        { fromClerkId: currentUserId, toClerkId: userToChatId },
        { fromClerkId: userToChatId, toClerkId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    // console.log("Get Messages: ", messages[0].text);
    res.status(200).json(messages);
  } catch (error) {
    console.error("error in getting message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { id: toClerkId } = req.params;
    const { text } = req.body;
    // const fromClerkId = "user_30GxtqCO3idGv0XV9m6T8OIXxE4";
    const fromClerkId = req.auth?.userId;
    if (!fromClerkId) {
      return res.status(400).json({ error: "Unauthorised User" });
    }

    const fromUser = await User.findOne({ clerkUserId: fromClerkId });
    const toUser = await User.findOne({ clerkUserId: toClerkId });

    //Handling the images and convert to buffer format and upload to imagekit
    let imageUrl;
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      const result = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.jpg`,
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
      image: imageUrl,
    });

    //Socket io Part
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
    console.error("Error in sending message controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { upload };
