import { Router } from "express";
import { getMessages, getUsers } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const chatRouter = Router();

/**
 * GET /api/chats/users
*/


chatRouter.get("/users", authUser, getUsers);
chatRouter.get("/:userId/messages", authUser, getMessages);


export default chatRouter;