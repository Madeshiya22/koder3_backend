import ImageKit from '@imagekit/nodejs';
import {config} from '../config/config.js';

 const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,      
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile({buffer,fileName, folder = "posts"}){
    try {
        const response = await imagekit.files.upload({
            file:await ImageKit.toFile(buffer),
            fileName,
            folder,
        });
        return response;
    } catch (error) {
        console.log(error); 
    }
}   

export default imagekit;