// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://happywedz.com/api/wishlist";

// ✅ Add to Wishlist
export const addToWishlist = createAsyncThunk(
    "wishlist/add",
    async ({ userId, vendorId }) => {
        const res = await axios.post(`${API_URL}`, { userId, vendorId });
        return res.data;
    }
);

// ✅ Get User Wishlist
export const getUserWishlist = createAsyncThunk(
    "wishlist/getUser",
    async (userId) => {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        return res.data;
    }
);

// ✅ Update Wishlist (rating, description)
export const updateWishlist = createAsyncThunk(
    "wishlist/update",
    async ({ id, rating, description }) => {
        const res = await axios.put(`${API_URL}/${id}`, { rating, description });
        return res.data;
    }
);

// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
    "wishlist/remove",
    async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [], // vendor cards with details
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Fetch
            .addCase(getUserWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getUserWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // ✅ Add
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            // ✅ Update
            .addCase(updateWishlist.fulfilled, (state, action) => {
                const idx = state.items.findIndex((i) => i._id === action.payload._id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                }
            })

            // ✅ Remove
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i._id !== action.payload);
            });
    },
});

export default wishlistSlice.reducer;
