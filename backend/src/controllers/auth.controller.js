import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = ("/signup", async (req, res) => {
    const { fullName, email, password} = req.body;
    try{
        if(password.length < 6){
            return res.status(404).json({ message: "Password must be greater than 6 characters" });
        }

        const user = await User.findOne(email);
        if(user){
            return res.status(404).json({ message: "Email already exist" });
        }

        const salt = await bcrypt.gensalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword 
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }else{
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (e){
        console.log("Error in signup", e.message);
        return res.status(500).json({ message: "Internal error" });
    }
})

export const login = ("/login", async (req, res) => {
    const  { email, password } = res.body;
    try{
        const user = await User.findOne(email);
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    }catch(e){
        console.log("Error in loin ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
})

export const logout = ("/logout", (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "Logout Successful"});
    }catch(e){
        console.log("Error in logout ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
})

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userID = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic required"});
        }

        const updateResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            {profilePic: updateResponse.secure_url},
            {new: true}
        )

        res.status(200).json(updatedUser)

    }catch(e){
        console.log("Error in update profile ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(e){
        console.log("Error in check auth ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}