import { User } from "../models/user.model.js"

export const authCallback = async (req, res, next) =>{
    try {
        const {id, firstName, lastName, imageUrl} = req.body;

        const user = await User.findOne({clerkId: id});

        if(!user){
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            })
        }
        req.statusCode(201).json({sucess:true});
    } catch (error) {
        console.log("Error in auth callback", error);
        req.statusCode(500).json({messa: "Internal server error"});
        next(error)
    }   
}