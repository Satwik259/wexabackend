import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/config.js";
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 9032

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 server is Listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
