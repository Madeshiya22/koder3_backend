import {Router} from 'react'
import { getUsers } from '../controllers/chat.controller';
import { authUser } from '../middleware/auth.middleware';

const router = Router ();

/**
 * GET /api/chats/users
*/

router.get('/users',authUser, getUsers);


export default chatRouter; 