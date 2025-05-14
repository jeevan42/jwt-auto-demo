import { Router } from "express";
import { GetProfileHandler, LoginHandler, SignupHandler, LogoutHandler } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(`/signup`, SignupHandler);
router.post(`/login`, LoginHandler);
router.get(`/profile`, authMiddleware , GetProfileHandler);
router.post(`/logout`, authMiddleware , LogoutHandler);

export default router;