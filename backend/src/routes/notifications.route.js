import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  getNotificationDetails,
} from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.get("/details/:id", authMiddleware, getNotificationDetails);

export { router };
