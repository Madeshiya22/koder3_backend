import {uploadPost} from "../services/post.service.js";


export async function uploadImg(req, res) {
  const posts = req.files;
  const uploadPromises = posts.map(async (post) => {
    return await uploadPost(post.buffer, post.originalname);
  });
  const result = await Promise.all(uploadPromises);
  res.status(200).json({ message: "Posts uploaded successfully", result });
}
