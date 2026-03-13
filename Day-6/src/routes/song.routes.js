import {Router} from 'express';
import  uploadSong  from '../controller/songs.controller.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const songsRouter = Router()


songsRouter.post('/',upload.single('song'),uploadSong)

export default songsRouter;