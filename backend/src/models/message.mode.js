 import mongoose from 'mongoose';

 const messageSchema = new mongoose.Schema(
    {
        senderId: {
            typeof: String,
            required: true
        },
        receiverId: {
            typeof: String,
            required: true
        },
        content:{
            typeof: String,
            required: true
        }
    },
    {timestamps:true}
 )


 export const Message = mongoose.model("Message", messageSchema);

 