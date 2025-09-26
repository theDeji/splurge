import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types';

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const findIndex = (items: CartItem[], productId: string) =>
  items.findIndex(i => i.productId === productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) { state.items = action.payload; },
    addToCart(state, action: PayloadAction<{ productId: string; qty?: number }>) {
      const { productId, qty = 1 } = action.payload;
      const idx = findIndex(state.items, productId);
      if (idx >= 0) state.items[idx].quantity += qty;
      else state.items.push({ productId, quantity: qty });
    },
    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter(i => i.productId !== action.payload.productId);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const idx = findIndex(state.items, action.payload.productId);
      if (idx >= 0) {
        if (action.payload.quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = action.payload.quantity;
      }
    },
    clearCart(state) { state.items = []; }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;