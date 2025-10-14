import { createSlice } from "@reduxjs/toolkit";
import { vendorLogout } from "./vendorAuthSlice";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export const loginUser = (payload) => (dispatch) => {
    dispatch(vendorLogout());
    dispatch(setCredentials(payload));
};

export const toggleWishlist = (vendor) => async (dispatch, getState) => {
    const { auth } = getState();
    const { token, user } = auth;

    if (!token || !user) {
        // User is not logged in, redirect to login page
        // We can use window.location for a simple redirect.
        // A more integrated approach would be to use the router's navigate function,
        // which might require passing it to the thunk.
        alert("Please log in to add items to your wishlist.");
        window.location.href = `/customer-login?redirect=/vendors/${vendor.slug || vendor.id}`;
        return;
    }

    try {
        const response = await fetch("https://happywedz.com/api/wishlist/toggle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: user.id, vendor_services_id: vendor.id }),
        });
        // You might want to dispatch an action to update the wishlist state in Redux
        // after a successful toggle, so the UI updates instantly.
        // For now, we'll rely on the component to refetch.
        if (!response.ok) {
            console.error("Failed to toggle wishlist");
        }
    } catch (error) {
        console.error("Error toggling wishlist:", error);
    }
};

export default authSlice.reducer;
