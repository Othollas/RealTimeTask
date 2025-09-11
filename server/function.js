import jwt from "jsonwebtoken";
import 'dotenv/config'

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString().substring(2, 9)
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    });
};


export const verifyTokenWS = (token) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return null;
    }
};

export default verifyToken;