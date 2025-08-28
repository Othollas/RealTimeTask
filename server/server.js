import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";
import tasksRouter from "./routes/tasks.js"
import authRouter from "./routes/auth.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/api/categories/", categoriesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

const PORT = 3001;


connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
