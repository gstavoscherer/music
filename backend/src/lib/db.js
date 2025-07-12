import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`connected to mongo ${conn.connection.host}`);
    } catch (error) {
        console.log('failed to connect: ', error)
        process.exit(1);
    }
}