// import { useState, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { logout as logoutAction } from "../redux/authSlice";

// export const useUser = () => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const login = useCallback(async (formData, rememberMe = false) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await fetch("https://happywedz.com/api/user/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();

//             if (data.success && data.data) {
//                 const { user, token } = data.data;
//                 dispatch(setAuth({ user, token }));

//                 if (rememberMe) {
//                     localStorage.setItem("user", JSON.stringify(user));
//                     localStorage.setItem("token", token);
//                 }

//                 return { success: true, user, token };
//             } else {
//                 setError(data.message || "Login failed");
//                 return { success: false, message: data.message };
//             }
//         } catch (err) {
//             setError(err.message || "Login error");
//             return { success: false, message: err.message };
//         } finally {
//             setLoading(false);
//         }
//     }, [dispatch]);

//     const logout = useCallback(() => {
//         dispatch(logoutAction());
//     }, [dispatch]);

//     return { login, logout, loading, error };
// };
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuth, logout as logoutAction } from "../redux/authSlice";

export const useUser = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(
        async (formData, rememberMe = false) => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("https://happywedz.com/api/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.success && data.data) {
                    const { user, token } = data.data;

                    // ✅ Store in Redux
                    dispatch(setAuth({ user, token }));

                    // ✅ Store in localStorage or sessionStorage
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem("user", JSON.stringify(user));
                    storage.setItem("token", token);

                    return { success: true, user, token };
                } else {
                    setError(data.message || "Login failed");
                    return { success: false, message: data.message };
                }
            } catch (err) {
                setError(err.message || "Login error");
                return { success: false, message: err.message };
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const logout = useCallback(() => {
        // clear redux
        dispatch(logoutAction());

        // clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
    }, [dispatch]);

    return { login, logout, loading, error };
};
