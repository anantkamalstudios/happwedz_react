import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import vendorAuthReducer from "./vendorAuthSlice";
import locationReducer from "./locationSlice";
import wishlistReducer from "./wishlistSlice";
import roleReducer from "./roleSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorAuth: vendorAuthReducer,
    location: locationReducer,
    wishlist: wishlistReducer,
    role: roleReducer,
  },
});

export default store;
