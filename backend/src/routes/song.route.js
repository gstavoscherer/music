import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import SongController from "../controller/song.controller.js";

class SongRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/songs",
      AuthMiddleware.protectRoute,
      AuthMiddleware.requireAdmin,
      SongController.getAllSongs
    );
    this.router.get("/songs/featured", SongController.getFeaturedSongs);
    this.router.get("/songs/made-for-you", SongController.getMadeForYouSongs);
    this.router.get("/songs/trending", SongController.getTrendingSongs);
    this.router.get("/songs/:id", SongController.getSongById);
  }

  getRouter() {
    return this.router;
  }
}

export default new SongRoutes().getRouter();
