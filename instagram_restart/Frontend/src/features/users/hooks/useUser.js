import { searchUser } from "../service/users.api";
import { appendRequest } from "../../../user.slice";
import { useDispatch } from "react-redux";
import { use } from "react";

export const useUser = () => {

    const dispatch  = useDispatch()

    async function handleSearchUser({ query }) {
        const data = await searchUser({ query })
        return data
    }

    async function handleFollowUser({ userId }) {
  const data = await followUser({ userId })
        dispatch(appendRequest(userId))
        return data.follow
    }


    return {
        handleSearchUser,
        handleFollowUser
    }

}