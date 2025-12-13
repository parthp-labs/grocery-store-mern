import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, loading: true };

export const userReducer = createSlice({
  name: "userReducer",
  initialState: initialState,
  reducers: {
    userExists: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExists: (state, action) => {
      state.loading = false;
      state.user = null;
    },
    updateCart: (state, action) => {
      state.user.cart = action.payload.cart;
    },
  },
});

export const { userExists, userNotExists, updateCart } = userReducer.actions;
