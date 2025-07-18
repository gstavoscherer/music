import { User } from "../models/user.model.js";

class AuthController {
  static async authCallback(req, res, next) {
    try {
      const { id, firstName, lastName, imageUrl } = req.body;
      console.log("Auth callback", id, firstName, lastName, imageUrl);
      const user = await User.findOne({ clerkId: id });
      console.log(req.body);
      if (!user) {
        await User.create({
          clerkId: id,
          fullName: `${firstName} ${lastName}`,
          imageUrl,
        });
      }
      res.status(201).json({ success: true });
    } catch (error) {
      console.log("Error in auth callback", error);
      res.status(500).json({ message: "Internal server error" });
      next(error);
    }
  }
}

export default AuthController;
