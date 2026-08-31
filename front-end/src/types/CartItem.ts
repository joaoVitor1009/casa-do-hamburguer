import type { ProductInterface } from "./Product";

export interface CartItemInterface {
  id: string;
  userId: string;
  productId: string;
  productid: ProductInterface;
  quantity: number;
}

export type CartItemsTypeContext = {
  cartItems: CartItemInterface[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemInterface[]>>;
  getCartItems: () => Promise<void>;
};
