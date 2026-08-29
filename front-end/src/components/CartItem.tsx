import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const CartItem = () => {
  return (
    <div className="flex items-center gap-3">
      <img src="./duplo_da_casa.jpg" alt="" className="w-25 rounded-md" />
      <div className="flex-1">
        <p className="font-bold uppercase">duplo da casa</p>
        <p className="font-bold text-gray-600 uppercase">r$ 28,40</p>
        <div className="mt-1">
          <div className="flex gap-[8px]">
            <ChevronLeft className="cursor-pointer rounded-md bg-[#C92A0E] p-1 text-white" />
            <p>1</p>
            <ChevronRight className="cursor-pointer rounded-md bg-[#C92A0E] p-1 text-white" />
          </div>
        </div>
      </div>
      <Trash2 className="size-5 cursor-pointer" />
    </div>
  );
};

export default CartItem;
