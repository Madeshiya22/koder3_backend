import { searchUser, followUser, unfollowUser, getFollowRequests, acceptFollowRequest } from "../service/users.api"
import { appendRequest, setFollowRequest, acceptFollowRequestState } from "../../user.slice"
import { useDispatch } from "react-redux"

export const useUser = () => {

    const dispatch = useDispatch()

    async function handleSearchUser({ query }) {
        const data = await searchUser({ query })
        return data
    }

    async function handleFollowUser({ userId }) {
        const data = await followUser({ userId })
        if (data?.follow?.status === 'pending') {
            dispatch(appendRequest(userId))
        }
        return data.follow
    }

    async function handleUnfollowUser({ userId }) {
        const data = await unfollowUser({ userId })
        return data
    }

    async function handleGetFollowRequests() {
        const data = await getFollowRequests()
        dispatch(setFollowRequest(data.requests))
    }

    async function handleAcceptFollowRequest({ requestId }) {
        const data = await acceptFollowRequest({ requestId })
        dispatch(acceptFollowRequestState(requestId))
        return data
    }

    return {
        handleSearchUser,
        handleFollowUser,
        handleUnfollowUser,
        handleGetFollowRequests,
        handleAcceptFollowRequest
    }
}