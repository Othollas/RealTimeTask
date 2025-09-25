import express from "express";
import verifyToken from "../function.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res)=>{
console.log("req")
})

export default router;