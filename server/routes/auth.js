import express, { Router } from "express";
import bcrypt from "bcrypt"
import User from "../schemas/userSchema.js";

const router = express.Router();

router.post("/register", async (req, res) => {

    try {
        const is_valid = req.body.username != '' && req.body.email.length > 6 && req.body.password.length > 6;

        if (!is_valid) { return res.status(400).json({ message: 'Erreur de champ' }) };


        const { username, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashPassword,
            created_at: new Date(),
            updated_at: new Date(),
        }

        const createdUser = await User.create(newUser);



        res.status(201).json({
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            message: "utilisateur crée",
            ok: true
        });

    } catch (err) {
          if (err.code === 11000) {
            return res.status(400).json({ message: "Email ou Pseudo déja utilisé" })
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message })
        }
        console.error(err);
        res.status(500).json({ message: "Erreur server" })
    }
});


router.post("/login", async (req, res) => {
    console.log(req.body)
})



export default router;