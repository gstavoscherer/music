import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "https://music.gustavoscherer.com"],
        credentials: true,
      },
    });

    this.userSockets = new Map();
    this.userActivities = new Map();

    this.io.on("connection", (socket) => this.handleConnection(socket));
  }

  handleConnection(socket) {
    socket.on("user_connected", (userId) => {
      this.userSockets.set(userId, socket.id);
      this.userActivities.set(userId, "Idle");

      this.io.emit("user_connected", userId);
      socket.emit("users_online", Array.from(this.userSockets.keys()));
      this.io.emit("activities", Array.from(this.userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      this.userActivities.set(userId, activity);
      this.io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({ senderId, receiverId, content });

        const receiverSocketId = this.userSockets.get(receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of this.userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          this.userSockets.delete(userId);
          this.userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        this.io.emit("user_disconnected", disconnectedUserId);
      }
    });
  }
}
