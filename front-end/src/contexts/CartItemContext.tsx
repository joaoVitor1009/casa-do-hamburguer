import { createContext, useState, type ReactNode } from "react";
import type {
  CartItemInterface,
  CartItemsTypeContext,
} from "../types/CartItem";
import type {} from "../types/CartItem";

export const CartItemContext = createContext<CartItemsTypeContext>({
  cartItems: [],
  setCartItems: () => {},
});

export const CartItemProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  return (
    <CartItemContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartItemContext.Provider>
  );
};
