import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

let persistedVendor = null;
let persistedToken = null;
try {
  const vendorStr =
    typeof localStorage !== "undefined" ? localStorage.getItem("vendor") : null;
  persistedVendor = vendorStr ? JSON.parse(vendorStr) : null;
  persistedToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("vendorToken")
      : null;
} catch {
  persistedVendor = null;
  persistedToken = null;
}

const initialState = {
  vendor: persistedVendor,
  token: persistedToken,
};

const vendorAuthSlice = createSlice({
  name: "vendorAuth",
  initialState,
  reducers: {
    setVendorCredentials: (state, action) => {
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;

      localStorage.setItem("vendor", JSON.stringify(action.payload.vendor));
      localStorage.setItem("vendorToken", action.payload.token);
    },
    vendorLogout: (state) => {
      state.vendor = null;
      state.token = null;
      localStorage.removeItem("vendor");
      localStorage.removeItem("vendorToken");
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      localStorage.setItem("vendor", JSON.stringify(action.payload));
    },
  },
});

export const { setVendorCredentials, vendorLogout, setVendor } =
  vendorAuthSlice.actions;
export const loginVendor = (payload) => (dispatch) => {
  dispatch(logout());
  dispatch(setVendorCredentials(payload));
};
export default vendorAuthSlice.reducer;
