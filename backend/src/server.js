import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// middleware
import corsOptions from "./config/corsOptions.js";
import { requestLogger } from "./utils/logger.js";
// routes
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(requestLogger);

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes)
app.use("/content", contentRoutes);
app.use("/logs", logRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
