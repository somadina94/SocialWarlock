import { createSlice } from "@reduxjs/toolkit";

const initialState = { showSlide: false, depoSlide: false };

const slideSlice = createSlice({
  name: "Slide",
  initialState,
  reducers: {
    showSlide(state) {
      state.showSlide = true;
    },
    hideSlice(state) {
      state.showSlide = false;
    },
    showDepoSlide(state) {
      state.depoSlide = true;
    },
    hideDepoSlide(state) {
      state.depoSlide = false;
    },
  },
});

export const slideActions = slideSlice.actions;

export default slideSlice;
