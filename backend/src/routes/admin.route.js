import { Router } from "express";
import AdminController from "../controller/admin.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

class AdminRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.use(AuthMiddleware.protectRoute, AuthMiddleware.requireAdmin);
    this.router.get("/admin/check", AdminController.checkAdmin);
    this.router.post("/admin/songs", AdminController.createSong);
    this.router.delete("/admin/songs/:id", AdminController.deleteSong);
    this.router.post("/admin/albums", AdminController.createAlbum);
    this.router.delete("/admin/albums/:id", AdminController.deleteAlbum);
  }

  getRouter() {
    return this.router;
  }
}

export default new AdminRoutes().getRouter();
