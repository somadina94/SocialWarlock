import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSpinner: false,
};

const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    showSpinner(state) {
      state.showSpinner = true;
    },
    hideSpinner(state) {
      state.showSpinner = false;
    },
  },
});

export const spinnerActions = spinnerSlice.actions;

export default spinnerSlice;
