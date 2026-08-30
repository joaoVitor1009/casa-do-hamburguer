import type { ProductInterface } from "./Product";

export interface CartItemInterface {
  id: string;
  userId: string;
  productId: string;
  productid: ProductInterface;
}

export type CartItemsTypeContext = {
  cartItems: CartItemInterface[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemInterface[]>>;
};
