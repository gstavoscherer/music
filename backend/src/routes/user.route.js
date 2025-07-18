import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import UserController from "../controller/user.controller.js";

class UserRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/users/",
      AuthMiddleware.protectRoute,
      UserController.getAllUsers
    );
    this.router.get(
      "/users/messages/:userId",
      AuthMiddleware.protectRoute,
      UserController.getMessages
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoutes().getRouter();
