import { X } from "lucide-react";
import Button from "./Button";
import CartItem from "./CartItem";

type cartTypes = {
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showCart: boolean;
};

const Cart = ({ setShowCart, showCart }: cartTypes) => {
  return (
    <div className="absolute right-0 flex h-screen flex-col bg-[#F2DAAC] p-5 md:w-141.25">
      <div className="flex justify-between">
        <X className="cursor-pointer" onClick={() => setShowCart(!showCart)} />
        <p className="font-bold uppercase">meu carrinho</p>
      </div>
      <div className="mt-10 flex flex-1 flex-col gap-2">
        <CartItem />
        <CartItem />
      </div>
      <Button title="Finalizar pedido" />
    </div>
  );
};
export default Cart;
