import express from "express";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv"
import { connetDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("server litening at port: " + PORT);
    connetDB();
})