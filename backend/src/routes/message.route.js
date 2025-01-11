import express from "express";
import { protectedRoute } from "../middleWare/auth.middleWare.js";
import { getMessage, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessage)

router.post("/send/:id", protectedRoute, sendMessage)

export default router;