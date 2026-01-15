import express from "express";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/.env" });

import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

// ROUTES
import userRoutes from "./routes/userRoutes.js";
import itemsRoutes from "./routes/itemsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import blogsRoutes from "./routes/blogsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import { webhookController } from "./controllers/paymentController.js";
import morgan from "morgan";

// APP
const app = express();

// CONFIG
const staticFolder = path.join(__dirname, "public");
app.use("/public", express.static(staticFolder));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  webhookController
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: "Content-disposition",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(morgan("dev"));

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ROUTES
app.use("/api/v1", userRoutes);
app.use("/api/v1", itemsRoutes);
app.use("/api/v1", ordersRoutes);
app.use("/api/v1", blogsRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", messageRoutes);
app.use("/api/v1/admin", adminRoutes);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandlerMiddleware);

app.get("/test", (req, res, next) => {
  res.json({ status: "Server is working" }, 200);
});

export default app;

// CONNECTING DATABASE AND RUNNING APP
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log(`MongoDB connected to database: ${mongoose.connection.name}`);

//     const server = app.listen(process.env.PORT, "0.0.0.0", () => {
//       const addressInfo = server.address();
//       console.log(
//         `Server is running at: http://${addressInfo.address}:${addressInfo.port}`
//       );
//     });
//   })
//   .catch((error) => {
//     console.log(
//       "Unable to connect to MongoDB and run server due to following error"
//     );
//     console.log(error.message);
//   });
