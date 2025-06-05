import express from "express";
import connectDB from "./db.js";
import answerRoutes from "./routes/answer.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", answerRoutes);

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
