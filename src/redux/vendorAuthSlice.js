import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendor: null,
  token: null,
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
  },
});

export const { setVendorCredentials, vendorLogout } = vendorAuthSlice.actions;
export default vendorAuthSlice.reducer;
