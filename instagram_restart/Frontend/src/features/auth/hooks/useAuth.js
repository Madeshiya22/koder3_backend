import { register } from "../services/auth.api.js";
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


    return {
        handelRegister
    };
}

export default useAuth