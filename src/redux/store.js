import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import vendorAuthReducer from "./vendorAuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorAuth: vendorAuthReducer,
  },
});

export default store;
