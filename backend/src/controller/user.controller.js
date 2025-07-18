import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const auth = await req.auth();
      const currentUserId = auth.userId;

      const users = await User.find({ clerkId: { $ne: currentUserId } });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req, res, next) {
    try {
      const auth = await req.auth();
      const myId = auth.userId;
      const { userId } = req.params;

      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: myId },
          { senderId: myId, receiverId: userId },
        ],
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
