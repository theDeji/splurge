import { createSlice } from '@reduxjs/toolkit';
import { PRODUCTS } from '../data/products';

const productsSlice = createSlice({
  name: 'products',
  initialState: PRODUCTS,
  reducers: {}
});

export default productsSlice.reducer;