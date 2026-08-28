import { ShoppingBag } from "lucide-react";
import type { ProductInterface } from "../types/Product";
import { formatterPrice } from "../utils/FormatterPrice";

const Product = ({
  id,
  name,
  description,
  price,
  img,
  category,
}: ProductInterface) => {
  const imagem = () => {
    return "./" + img;
  };

  return (
    <div>
      <div className="flex gap-2.5">
        <img
          src={imagem()}
          alt=""
          className="h-20.75 w-25.75 rounded-sm md:h-41.5 md:w-50"
        />
        <div className="flex w-full flex-col">
          <p className="text-sm font-bold text-white uppercase md:text-lg">
            {name}
          </p>
          <p className="flex-1 text-xs text-[#848484] md:text-lg">
            {description}
          </p>
          <div className="flex items-center justify-end gap-2 text-sm text-[#F2DAAC] md:text-lg">
            <p>{formatterPrice(price)}</p>
            <ShoppingBag className="size-3.5 cursor-pointer text-white md:size-4.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
