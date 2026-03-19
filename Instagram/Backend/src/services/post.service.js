import client from "../config/imagekit.js";
import ImageKit from "@imagekit/nodejs";



export async function uploadPost(buffer,fileName) {
    try {
        const response = await client.files.upload({
            file: await ImageKit.toFile(buffer, fileName),
            fileName
        });
        return response;
    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
    }
}


