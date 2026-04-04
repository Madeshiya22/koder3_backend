import axios from "axios"

export async function getPosts() {
    const response = await axios.get("http://localhost:3000/api/posts", {
        withCredentials: true
    })

    return response.data
}

export async function createPost({ files, caption }) {

    const formData = new FormData()
    formData.append("caption", caption)
    for (let i = 0; i < files.length; i++) {
        formData.append("media", files[i])
    }

    const response = await axios.post("http://localhost:3000/api/posts/create", formData, { withCredentials: true })

    return response.data
}
