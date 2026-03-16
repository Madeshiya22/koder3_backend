import imagekit from '../config/imagekit.config.js'
import {toFile} from '@imagekit/nodejs'

const uploadSongs = async (req, res) => {

      try{
        const file = req.file
        const result = await imagekit.files.upload({
            file: await toFile(file.buffer, file.originalname),
            fileName: file.originalname
        })
        res.json({URL: result.url}) 

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to upload song"})
    }
}

export default uploadSongs