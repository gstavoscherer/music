import { User } from '../models/user.model.js'; 
export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.auth.userId
        const users = await User.find({
            clerkId: { $ne: currentUserId }
        })
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers", error);
        res.status(500).json({message: "Internal server error"});
    }
}