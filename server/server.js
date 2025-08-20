import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",  // ton front
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/api/categories", categoriesRouter);

const PORT = 3001;


connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
