import express from "express"
import { searchUser,followUser  } from "../controllers/user.controller.js"
import {authUser} from "../middleware/auth.middleware.js"
import { validateFollowUser } from "../validator/user.validators.js"


const router = express.Router()

router.get("/search", searchUser)

router.post("/follow/:userId", authUser, validateFollowUser, followUser)

export default router;
