import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartVisibility: false,
  cart: [],
  totalPrice: 0,
  totalQuantity: 0,
  showPayment: false,
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    showCart(state) {
      state.cartVisibility = true;
    },
    hideCart(state) {
      state.cartVisibility = false;
    },
    add(state, action) {
      const newItem = action.payload;
      const existingItem = state.cart.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.cart.push({
          name: newItem.name,
          id: newItem.id,
          quantity: newItem.quantity,
          summedPrice: newItem.price * newItem.quantity,
          price: newItem.price,
        });
        state.totalPrice = state.totalPrice + newItem.price * newItem.quantity;
      } else {
        existingItem.quantity = existingItem.quantity + newItem.quantity;
        existingItem.summedPrice = existingItem.summedPrice + newItem.price;
        state.totalPrice = state.totalPrice + newItem.price * newItem.quantity;
      }
    },
    remove(state, action) {
      const id = action.payload;
      const existingItem = state.cart.find((prod) => prod.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.cart = state.cart.filter((prod) => prod.id !== id);
        state.totalPrice = state.totalPrice - existingItem.price;
      } else {
        existingItem.quantity--;
        existingItem.summedPrice =
          existingItem.summedPrice - existingItem.price;
        state.totalPrice = state.totalPrice - existingItem.price;
      }
    },
    clearCart(state) {
      state.cart = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.cartVisibility = false;
    },
    setOrderNum(state, action) {
      state.oderNum = action.payload.oderNum;
    },
    displayPay(state) {
      state.showPayment = true;
    },
    hidePay(state) {
      state.showPayment = false;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
