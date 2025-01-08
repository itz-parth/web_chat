import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({messege: "Unautherized: No Token Found"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
       return res.status(401).json({messege: "Unautherized: No Token Found"});
    }

    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
        returnres.status(404).json({messege: "User not found"})
    }

    req.user = user;
    next();
    }catch(e){
        console.log("Error in protected route ", e);
        res.status(500).json({messege: "Internal Server Error"})
    }
}