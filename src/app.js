import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import dotenv from "dotenv"
dotenv.config()




const app = Express();
console.log(process.env.CORS_ORIGIN);
//middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(Express.json({ limit: "16kb" }));
app.use(Express.urlencoded({ extended: true, limit: "16kb" }));
app.use(Express.static("public"));

//router imports
import checkConnection from "./routes/check.router.js";
import userRouters from "./routes/user.routers.js";

//routes declaration
app.use("/api/v1/users", userRouters);
app.use("/api/v1", checkConnection);

app.use(errorHandler);
export { app };
