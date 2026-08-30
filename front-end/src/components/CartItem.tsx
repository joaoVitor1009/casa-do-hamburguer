import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { formatterPrice } from "../utils/FormatterPrice";

type CartTypes = {
  title: string;
  price: number;
  img: string;
  id: string;
};

const CartItem = ({ title, price, img, id }: CartTypes) => {
  return (
    <div className="flex items-center gap-3">
      <img src={img} alt="" className="h-20.75 w-25 rounded-md" />
      <div className="flex-1">
        <p className="text-md font-bold uppercase">{title}</p>
        <p className="font-bold text-gray-600 uppercase">
          {formatterPrice(price)}
        </p>
        <div className="mt-1">
          <div className="flex items-center gap-2">
            <ChevronLeft className="cursor-pointer rounded-md bg-[#C92A0E] p-1 text-white" />
            <p className="font-bold">1</p>
            <ChevronRight className="cursor-pointer rounded-md bg-[#C92A0E] p-1 text-white" />
          </div>
        </div>
      </div>
      <Trash2
        className="size-5 cursor-pointer"
        onClick={() => {
          alert(id);
        }}
      />
    </div>
  );
};

export default CartItem;
