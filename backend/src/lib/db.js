import mongoose from "mongoose";

export const connetDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connnected: ${conn.connection.host}`);
    }catch (e){
        console.log('MongoDB error: ', e);
    }
}