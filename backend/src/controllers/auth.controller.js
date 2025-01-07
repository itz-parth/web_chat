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

    } catch (e){
        console.log("Error in signup", e.message);
        return res.status(500).json({ message: "Internal error" });
    }
})

export const login = ("/login", (req, res) => {
    res.send("login route")
})

export const logout = ("/logout", (req, res) => {
    res.send("logout route")
})