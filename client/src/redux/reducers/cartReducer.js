import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  cartItems: [],
  subTotal: 0,
  total: 0,
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.loading = true;

      // Increasing the quantity of the item when item already exists
      const index = state.cartItems.findIndex(
        (i) => i.itemId === action.payload.itemId
      );

      if (index) {
        state.cartItems[index].quantity = action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
    },
    removeFromCart: (state, action) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.itemId !== action.payload
      );

      state.loading = false;
    },
    calculateTotal: (state, action) => {
      state.total = state.cartItems.reduce(
        (total, item) => total + item.discountedPrice * item.quantity
      );
    },
  },
});

export const { addToCart, removeFromCart, calculateTotal } =
  cartReducer.actions;
