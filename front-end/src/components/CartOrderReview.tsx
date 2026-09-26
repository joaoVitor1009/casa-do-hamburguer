import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemContext } from "../contexts/CartItemContext";
import { useContext, useState } from "react";

type CartOrderReviewProps = {
  img: string;
  title: string;
  description: string;
  price: number;
  id: string;
  quantity: number;
};

export const CartOrderReview = ({
  img,
  title,
  description,
  price,
  id,
  quantity,
}: CartOrderReviewProps) => {
  const { getCartItems } = useContext(CartItemContext);

  async function handleUpdateQuantity(id: string, newQuantity: number) {
    try {
      if (!id) return;

      if (newQuantity > 10) {
        alert("Quantidade máxima atingida");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/updateCartItem/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        alert("Erro ao atualizar quantidade do item");
        return;
      }

      getCartItems();
      return;
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  async function handleDeleteItem(id: string) {
    try {
      const response = await fetch(
        `http://localhost:3000/deleteCartitem/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        alert("Erro ao deletar item do carrinho");
        return;
      }

      getCartItems();
      return;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#2d2820] bg-[#1a1713] p-4">
      <div className="flex items-center gap-4">
        <img
          src={img}
          alt={title}
          className="h-20 w-20 rounded-lg object-cover md:h-24 md:w-24"
        />
        <div className="max-w-[160px] md:max-w-xs">
          <h3 className="text-sm font-bold text-[#F2DAAC] uppercase md:text-base">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-[#9d9d94]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[#4a4235] text-[#F2DAAC] hover:bg-[#2e2920]">
            <Minus
              size={14}
              onClick={() => {
                handleUpdateQuantity(id, quantity - 1);
                if (quantity <= 1) {
                  handleDeleteItem(id);
                }
              }}
            />
          </button>
          <p className="w-4 text-center font-bold text-[#F2DAAC]">{quantity}</p>
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[#4a4235] text-[#F2DAAC] hover:bg-[#2e2920]">
            <Plus
              size={14}
              onClick={() => handleUpdateQuantity(id, quantity + 1)}
            />
          </button>
        </div>

        <p className="min-w-[65px] text-right text-sm font-bold text-[#F2DAAC] md:text-base">
          R${price.toFixed(2)}
        </p>

        <button className="cursor-pointer text-red-500 hover:text-red-400">
          <Trash2 size={18} onClick={() => handleDeleteItem(id)} />
        </button>
      </div>
    </div>
  );
};
