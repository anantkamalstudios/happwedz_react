import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import vendorAuthReducer from "./vendorAuthSlice";
import locationReducer from "./locationSlice";
import wishlistReducer from "./wishlistSlice";
import roleReducer from "./roleSlice";
import favoriteReducer from "./favoriteSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorAuth: vendorAuthReducer,
    location: locationReducer,
    wishlist: wishlistReducer,
    role: roleReducer,
    favorites: favoriteReducer,
  },
});

export default store;
