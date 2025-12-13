import { createSlice } from "@reduxjs/toolkit";

const initialState = { loading: false };

export const loaderReducer = createSlice({
  name: "loaderReducer",
  initialState: initialState,
  reducers: {
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderReducer.actions;
export default loaderReducer.reducer;
