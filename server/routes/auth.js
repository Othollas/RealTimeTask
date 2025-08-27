import express, { Router } from "express";
import bcrypt from "bcrypt"

const router = express.Router();

router.post("/register", async (req, res)=>{
    console.log(req.body);

    const hashPassword = await bcrypt.hash(req.body.password, 10)
    console.log(hashPassword);

})


export default router;