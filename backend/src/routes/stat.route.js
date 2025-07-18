import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import StatController from "../controller/stat.controller.js";

class StatRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/stats",
      AuthMiddleware.protectRoute,
      AuthMiddleware.requireAdmin,
      StatController.getStats
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new StatRoutes().getRouter();
