import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLocation: localStorage.getItem("location") || null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.selectedLocation = action.payload;
      localStorage.setItem("location", action.payload);
    },
    clearLocation: (state) => {
      state.selectedLocation = null;
      localStorage.removeItem("location");
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
