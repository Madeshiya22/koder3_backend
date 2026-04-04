import { register, login } from "../services/auth.api.js";
import { setUser } from "../auth.slice";
import { useDispatch } from "react-redux";

const useAuth = () => {

    const dispatch = useDispatch();

    async function handelRegister({
        username,
        fullname,
        email,
        password
    }) {
        try {
            const userData = await register({ username, fullname, email, password });
            dispatch(setUser(userData));
        } catch (error) {
            console.error("Registration failed", error);
        }
    }

    async function handleLogin({ usernameOrEmail, password }) {

        const data = await login({ usernameOrEmail, password })

        dispatch(setUser(data.user))

        return data
    }

    // async function handleGetMe() {
    //     const data = await getMe()
    //     dispatch(setUser(data.user))
    // }


    return {
        handelRegister,
        handleLogin,
        // handleGetMe
    };
}

export default useAuth