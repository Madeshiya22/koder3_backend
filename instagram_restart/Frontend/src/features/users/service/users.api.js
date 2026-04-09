import axios from "axios"

export async function searchUser({ query }) {

    const response = await axios.get("http://localhost:3000/api/users/search?q=" + query, {
        withCredentials: true
    })
    return response.data.users

}

export async function followUser({ userId }) {

    const response = await axios.post("http://localhost:3000/api/users/follow/" + userId, {}, {
        withCredentials: true
    })

    return response.data

}

export async function getFollowRequests() {
    const response = await axios.get("http://localhost:3000/api/users/follow-requests", {
        withCredentials: true
    })
    return response.data
}

export async function acceptFollowRequest({ requestId }) {
    const response = await axios.post("http://localhost:3000/api/users/follow-requests/" + requestId + "/accept", {}, {
        withCredentials: true
    })
    return response.data
}

export async function getProfile({ userId }) {
    const response = await axios.get(`http://localhost:3000/api/users/profile/${userId}`, {
        withCredentials: true
    })
    return response.data.user
}



