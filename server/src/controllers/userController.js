import { Webhook } from "svix";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const handleClerkWebhook = async (req, res) => {
  console.log("Webhook Received");

  try {
    const CLERK_WEBHOOK_SECRET_KEY = process.env.CLERK_WEBHOOK_SECRET_KEY;
    if (!CLERK_WEBHOOK_SECRET_KEY) {
      console.error("❌ Error: CLERK_WEBHOOK_SECRET_KEY is missing");
      return res.status(500).json({ success: false, message: "Server Error" });
    }

    const svixHeaders = req.headers;
    const payloadBuffer = req.body;
    const wh = new Webhook(CLERK_WEBHOOK_SECRET_KEY);
    const evt = wh.verify(payloadBuffer, svixHeaders);

    const { id, ...attributes } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook Event: ${eventType}, ID: ${id}`);
    console.log("Payload Attributes:", attributes);

    if (eventType === "user.created") {
      const existingUser = await User.findOne({ clerkUserId: id });
      if (!existingUser) {
        try {
          let email = "";
          if (
            Array.isArray(attributes.email_addresses) &&
            attributes.email_addresses.length > 0 &&
            attributes.email_addresses[0].email_address
          ) {
            email = attributes.email_addresses[0].email_address;
          }

          if (!email) {
            console.warn("Email missing in webhook payload");
            return res
              .status(400)
              .json({ success: false, message: "Email missing" });
          }

          const newUser = new User({
            clerkUserId: id,
            email: email,
            userName: attributes.username,
            firstName: attributes.first_name || "",
            lastName: attributes.last_name || "",
            profileImage: attributes.image_url || "",
          });

          await newUser.save();
          console.log("User saved to MongoDB:", newUser);
          return res
            .status(200)
            .json({ success: true, message: "User created" });
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, message: "Failed to create user" });
        }
      } else {
        console.log("ℹUser already exists");
        return res
          .status(200)
          .json({ success: true, message: "User already exists" });
      }
    } else if (eventType === "user.updated") {
      try {
        const updated = await User.updateOne(
          { clerkUserId: id },
          {
            $set: {
              email: attributes.email_addresses?.[0]?.email_address || "",
              firstName: attributes.first_name || "",
              lastName: attributes.last_name || "",
              userName: attributes.username || "",
              profileImage: attributes.profile_image_url || "",
            },
          }
        );

        if (updated.modifiedCount > 0) {
          console.log(`User with ID ${id} updated`);
          return res
            .status(200)
            .json({ success: true, message: "User updated" });
        } else {
          console.log(`No user with ID ${id} updated`);
          return res
            .status(200)
            .json({ success: false, message: "No changes made" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to update user" });
      }
    } else if (eventType === "user.deleted") {
      try {
        const deleted = await User.deleteOne({ clerkUserId: id });
        if (deleted.deletedCount > 0) {
          console.log(`User with ID ${id} deleted`);
          return res
            .status(200)
            .json({ success: true, message: "User deleted" });
        } else {
          console.log(`User with ID ${id} not found for deletion`);
          return res
            .status(200)
            .json({ success: false, message: "User not found" });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while deleting user",
        });
      }
    } else {
      console.log("Unhandled event type");
      return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("❌ Webhook verification failed:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// getUsers for sidebar
const getUsersForSidebar = async (req, res) => {
  try {
    // const currentUser = req.auth?.userId;
    // const filteredUsers = await User.find({
    //   clerkUserId: { $ne: currentUser },
    // });

    const { userId } = req.auth();
    const currentUser = userId;
    const filteredUsers = await User.find({
      clerkUserId: { $ne: currentUser },
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUserForSidebar controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { handleClerkWebhook, getUsersForSidebar };
