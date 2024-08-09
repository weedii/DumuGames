import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.type === action.payload.type &&
          item.amount === action.payload.amount &&
          item.region === action.payload.region
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex] = action.payload;
        toast.success(`${action.payload.type} added to cart!`);
      } else {
        const tmpCart = { ...action.payload };
        state.cartItems.push(tmpCart);
        toast.success(`${action.payload.type} added to cart!`);
      }
      // state.totalQuantity = state.cartItems.length;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      // localStorage.setItem(
      //   "cartItemsQuantity",
      //   JSON.stringify(state.totalQuantity)
      // );
    },

    removeFromCart: (state, action) => {
      const nextCartItems = state.cartItems.filter(
        (item) =>
          item.type !== action.payload.type ||
          (item.type === action.payload.type &&
            item.amount !== action.payload.amount) ||
          (item.type === action.payload.type &&
            item.amount === action.payload.amount &&
            item.region !== action.payload.region)
      );
      state.cartItems = nextCartItems;
      // state.totalQuantity = state.cartItems.length;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      // localStorage.setItem(
      //   "cartItemsQuantity",
      //   JSON.stringify(state.totalQuantity)
      // );
      toast(`${action.payload.type} removed from cart!`);
    },

    decreaseItemQuantity: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.type === action.payload.type &&
          item.amount === action.payload.amount
      );

      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
        // state.totalQuantity = state.cartItems.length;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },

    increaseItemQuantity: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.type === action.payload.type &&
          item.amount === action.payload.amount
      );

      if (
        state.cartItems[itemIndex].quantity >= 1 &&
        state.cartItems[itemIndex].quantity < 5
      ) {
        state.cartItems[itemIndex].quantity += 1;
        // state.totalQuantity = state.cartItems.length;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },

    getTotals: (state) => {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = quantity * price;

          cartTotal.total += itemTotal;
          cartTotal.quantity += 1;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.totalQuantity = quantity;
      state.totalAmount = Math.round(total * 100) / 100;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.setItem("cartItems", state.cartItems);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseItemQuantity,
  increaseItemQuantity,
  getTotals,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
