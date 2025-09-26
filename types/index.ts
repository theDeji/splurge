export type Product = {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};