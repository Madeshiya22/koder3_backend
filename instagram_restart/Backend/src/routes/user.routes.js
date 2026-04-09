import express from "express"
import { searchUser, followUser, getFollowRequests, acceptFollowRequest, getProfile } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import { validateFollowUser, validateFollowRequest } from "../validator/user.validators.js"

const router = express.Router()

router.get("/search", authUser, searchUser)

router.get("/profile/:userId", authUser, getProfile)

router.post("/follow/:userId", authUser, validateFollowUser, followUser)

router.get("/follow-requests", authUser, getFollowRequests)

router.post("/follow-requests/:requestId/accept", authUser, validateFollowRequest, acceptFollowRequest)

export default router;
