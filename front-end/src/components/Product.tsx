import { ShoppingBag } from "lucide-react";
import type { Productpros } from "../types/Product";
import { formatterPrice } from "../utils/FormatterPrice";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { CartItemContext } from "../contexts/CartItemContext";
const Product = ({
  id,
  name,
  description,
  price,
  img,
  category,
  getProducts,
}: Productpros) => {
  const { user } = useContext(UserContext);
  const { getCartItems } = useContext(CartItemContext);
  const imagem = () => {
    return img;
  };

  const handleDeleteProduct = async (id: any) => {
    try {
      const rotaDelete = "http://localhost:3000/deleteProduct/" + id;

      if (!rotaDelete) {
        console.log("Sem id enviado");
        return;
      }

      const response = await fetch(rotaDelete, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Erro ao realizar a operação");
        return;
      }

      if (response.ok) {
        getProducts();
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const newCartItem = async () => {
    try {
      const response = await fetch("http://localhost:3000/createCartitem", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: id }),
      });
      if (!response.ok) {
        console.log("Deu ruim");
        return;
      }
      getCartItems();
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
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
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white uppercase md:text-lg">
              {name}
            </p>
            {user?.admin && (
              <div
                className="flex cursor-pointer items-center rounded-md border px-0.5 text-sm text-red-600 uppercase"
                onClick={() => handleDeleteProduct(id)}
              >
                Deletar
              </div>
            )}
          </div>
          <p className="flex-1 text-xs text-[#848484] md:text-lg">
            {description}
          </p>
          <div className="flex items-center justify-end gap-2 text-sm text-[#F2DAAC] md:text-lg">
            <p>{formatterPrice(price)}</p>
            <ShoppingBag
              className="size-3.5 cursor-pointer text-white md:size-4.5"
              onClick={() => newCartItem()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
