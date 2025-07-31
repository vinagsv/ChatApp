import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "../src/libs/socket.js";

dotenv.config({
  path: ".env",
});

const PORT = process.env.PORT || 7001;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection Error", err);
  });
