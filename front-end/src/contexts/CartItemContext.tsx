import { createContext, useState, type ReactNode } from "react";
import type {
  CartItemInterface,
  CartItemsTypeContext,
} from "../types/CartItem";
import type {} from "../types/CartItem";

export const CartItemContext = createContext<CartItemsTypeContext>({
  cartItems: [],
  setCartItems: () => {},
  getCartItems: async () => {},
});

export const CartItemProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  const getCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/getItems", {
        credentials: "include",
      });

      if (!response.ok) {
        console.log("erro ao realizar a requisição");
        return;
      }

      const data = await response.json();
      setCartItems(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CartItemContext.Provider value={{ cartItems, setCartItems, getCartItems }}>
      {children}
    </CartItemContext.Provider>
  );
};
