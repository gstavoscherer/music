import { Router } from "express";
import AuthController from "../controller/auth.controller.js";

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post("/auth/callback", AuthController.authCallback);
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
