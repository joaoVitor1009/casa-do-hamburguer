import { X } from "lucide-react";
import Button from "./Button";
import CartItem from "./CartItem";
import { useContext, useEffect } from "react";
import { CartItemContext } from "../contexts/CartItemContext";

type cartTypes = {
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showCart: boolean;
};

const Cart = ({ setShowCart, showCart }: cartTypes) => {
  // const [carItems, setCartItems] = useState<CartItemInterface[]>([]);
  const { cartItems, setCartItems } = useContext(CartItemContext);

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

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="absolute right-0 z-1 flex h-screen w-87.5 flex-col bg-[#F2DAAC] p-5 md:w-141.25">
      <div className="flex justify-between">
        <X className="cursor-pointer" onClick={() => setShowCart(!showCart)} />
        <p className="font-bold uppercase">meu carrinho</p>
      </div>
      <div className="mt-10 flex flex-1 flex-col gap-2">
        {cartItems.map((item) => (
          <CartItem
            title={item.productid.name}
            price={item.productid.price}
            img={item.productid.img}
            id={item.productid.id}
            quantity={item.quantity}
          />
        ))}
      </div>
      <Button title="Finalizar pedido" />
    </div>
  );
};
export default Cart;
