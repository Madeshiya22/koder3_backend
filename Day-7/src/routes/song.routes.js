import {Router} from 'express'
import multer from 'multer'
import  uploadSong  from '../controllers/song.controller.js'


const songRouter =  Router()

const storage = multer.memoryStorage()
const upload = multer({storage})
songRouter.post('/', upload.single('song'), uploadSong)

export default songRouter

