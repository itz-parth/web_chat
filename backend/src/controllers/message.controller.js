import User from "../models/user.model.js";
import Message from "../models/messege.model.js"
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUser} }).select("-password");

        res.status(200).json(filteredUsers);
    }catch(e){
        console.log("Error in Sidebar Users ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMessage = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await MessageChannel.find({
            $or: [
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        })

        res.status(200).json(messages)

    }catch(e){
        console.log("Error in getMessage ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {text, image} = req.body;
        const {id: senderId} = req.params;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })

        res.status(201).json(newMessage);
    }catch(e){
        console.log("Error in sendMessage ", e.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}