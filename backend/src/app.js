import "dotenv/config";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { createServer } from "http";
import { SocketServer } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import fileUpload from "express-fileupload";
import { dirname, join, resolve } from "path";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  app;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.httpServer = createServer(this.app);
    new SocketServer(this.httpServer);
  }

  setupMiddleware() {
    this.app.use(fileUpload());
    this.app.use(express.json());
    this.app.use(clerkMiddleware());
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "https://music.gustavoscherer.com"],
        credentials: true,
      })
    );
  }

  setupRoutes() {
    this.app.use(
      "/uploads",
      express.static(resolve(__dirname, "..", "frontend", "uploads"))
    );

    this.app.use("/api", [
      adminRoutes,
      authRoutes,
      albumRoutes,
      songRoutes,
      statRoutes,
      userRoutes,
    ]);

    this.app.use(
      fileUpload({
        useTempFiles: false,
        createParentPath: true,
        limits: { fileSize: 10 * 1024 * 1024 },
      })
    );

    if (process.env.NODE_ENV === "production") {
      const frontendPath = join(__dirname, "..", "frontend", "dist");
      this.app.use(express.static(frontendPath));

      this.app.get("*", (req, res) => {
        res.sendFile(join(frontendPath, "index.html"));
      });
    }
  }

  async start() {
    const PORT = process.env.PORT || 3000;
    const httpServer = createServer(this.app);

    try {
      await connectDB();
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    }

    this.httpServer.listen(PORT, () => {
      console.log("✅ Server running on port " + PORT);
    });
  }
}

const server = new App();
server.start();
