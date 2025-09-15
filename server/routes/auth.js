import express, { Router } from "express";
import bcrypt from "bcrypt"
import User from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";
import 'dotenv/config'


const router = express.Router();


const generateToken = (userId, pseudo, userEmail) => {
    return jwt.sign({ id: userId, username: pseudo, email: userEmail }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

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

    try {
        const { email, password } = req.body;
        const searchEmail = email.toLowerCase()

        const response = await User.findOne({ email: searchEmail })
       
        if (!response || !(await bcrypt.compare(password, response.password))) {return res.status(401).json({ message: "Identifiant invalide", find: false}) }

        if(response.groups) {console.log(response.groups)}
        const token = generateToken(response._id, response.username, response.email);

        res.status(201).cookie("authToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Strict",
            maxAge: 3600000,
        }).json({ message: "Identifiant valide", find: true})



    } catch (error) {
        console.error(error)
    }

})

router.get("/me", (req, res) => {
    const token = req.cookies.authToken;
    if(!token) return res.status(401).json({ loggedIn: false });

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ loggedIn: true, user });
    }catch{
        res.status(401).json({ loggedIn: false });
    }
});


router.post("/logout", (req, res)=>{
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
    res.status(200).json({ message: "Utilisateur déconnecté" });
})

export default router;