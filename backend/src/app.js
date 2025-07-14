import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;
const httpServer = createServer(app);

initializeSocket(httpServer);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.use(clerkMiddleware());

// ⛔️ NÃO USAMOS TEMPFILES. Salva direto em /frontend/uploads
app.use(
	fileUpload({
		useTempFiles: false,
		createParentPath: true,
		limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
	})
);

// 🟢 Serve arquivos salvos no frontend
app.use(
	"/uploads",
	express.static(path.resolve("..", "frontend", "uploads"))
);


// 📦 Rotas
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// 🚀 Frontend (produção)
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// ❌ Handler de erro
app.use((err, req, res, next) => {
	res.status(500).json({
		message:
			process.env.NODE_ENV === "production"
				? "Internal server error"
				: err.message,
	});
});

httpServer.listen(PORT, () => {
	console.log("✅ Server running on port " + PORT);
	connectDB();
});
