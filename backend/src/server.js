import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions.js";
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/content", contentRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
