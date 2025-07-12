import express from "express";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/user.route.js"
import adminRoutes from "./routes/admin.route.js"
import authRoutes from "./routes/auth.route.js"
import songRoutes from "./routes/song.route.js"
import albumRoutes from "./routes/album.route.js"
import statsRoutes from "./routes/stat.route.js"
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload";


dotenv.config()

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT

app.use(express.json());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath:true,
    limits:{
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}))
app.use(clerkMiddleware);

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/songs", songRoutes)
app.use("/api/albuns", albumRoutes)
app.use("/api/stats", statsRoutes)

app.use("/uploads", express.static(path.join(__dirname, "tmp")))

app.use("/images", express.static(path.join(__dirname, "public/images")))

app.use("/public", express.static(path.join(__dirname, "public")))

app.listen(PORT, () => {
    console.log("server on " + PORT);
    connectDB();
})
