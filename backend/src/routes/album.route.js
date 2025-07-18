import { Router } from "express";
import AlbumController from "../controller/album.controller.js";

class AlbumRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/album", AlbumController.getAllAlbuns);
    this.router.get("/album/:id", AlbumController.getAlbumById);
  }

  getRouter() {
    return this.router;
  }
}

export default new AlbumRoutes().getRouter();
