import { AlertTriangle, Check, ShoppingBag } from "lucide-react";
import type { Productpros } from "../types/Product";
import { formatterPrice } from "../utils/FormatterPrice";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import { CartItemContext } from "../contexts/CartItemContext";
import { toast } from "sonner";
import CardProduct from "./CardProduct";
import { createPortal } from "react-dom";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const imageUrl = img?.startsWith("http")
    ? img
    : img?.startsWith("/")
      ? img
      : `/${img}`;

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
        toast.error("Erro ao excluir o produto.");
        return;
      }

      if (response.ok) {
        setIsConfirmDelete(false);
        toast.success("Produto excluído com sucesso!");
        getProducts();
        return;
      }
    } catch (e) {
      console.log(e);
      toast.error("Erro ao excluir o produto.");
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
        toast.error("Não foi possível adicionar ao carrinho.");
        return;
      }
      getCartItems();

      toast.custom((t) => (
        <div className="flex items-center gap-3 rounded-xl border border-[#F2DAAC] bg-[#F2DAAC] p-4 text-[#161410] shadow-2xl">
          <Check size={22} />
          <div>
            <p className="text-sm font-bold">{name.toUpperCase()}</p>
            <p className="text-xs text-[#161410]">
              Agora está em seu carrinho!
            </p>
          </div>
        </div>
      ));
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {/* Modal de Edição */}
      {isEditing && (
        <CardProduct
          showCartProduct={isEditing}
          setShowCartProduct={setIsEditing}
          productToEdit={{ id, name, description, price, img, category }}
          onSucess={getProducts}
        />
      )}

      {/* Modal de Confirmação de Deleção */}
      {isConfirmDelete &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="relative flex w-full max-w-md flex-col rounded-xl border border-red-500/30 bg-[#24211d] p-6 text-white shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Confirmar Exclusão
                  </h3>
                  <p className="text-xs text-[#9D9D94]">
                    Esta ação não poderá ser desfeita.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-[#1a1713] p-3 text-sm text-[#9D9D94]">
                Deseja realmente excluir o produto:
                <span className="mt-1 block text-base font-bold tracking-wide text-[#F2DAAC]">
                  {name.toUpperCase()}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-[#9D9D94]/30 px-4 py-2 text-sm font-semibold text-[#9D9D94] transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setIsConfirmDelete(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95"
                  onClick={() => handleDeleteProduct(id)}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className="flex gap-2.5">
        <div className="relative h-20.75 w-25.75 shrink-0 overflow-hidden rounded-sm bg-[#29251E] md:h-41.5 md:w-50">
          <img
            src={imageUrl}
            alt={name}
            loading="eager"
            decoding="async"
            ref={(imgEl) => {
              if (imgEl?.complete) {
                imgEl.classList.remove("opacity-0");
              }
            }}
            onLoad={(e) => {
              e.currentTarget.classList.remove("opacity-0");
            }}
            className="h-full w-full object-cover opacity-0 transition-opacity duration-300"
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white uppercase md:text-lg">
              {name}
            </p>
            {user?.admin && (
              <div className="flex items-center gap-2">
                <div
                  className="flex cursor-pointer items-center rounded-md border border-blue-500/50 px-1.5 py-0.5 text-xs text-blue-400 uppercase transition-colors hover:bg-blue-600 hover:text-white md:text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </div>
                <div
                  className="flex cursor-pointer items-center rounded-md border border-red-600/50 px-1.5 py-0.5 text-xs text-red-500 uppercase transition-colors hover:bg-red-600 hover:text-white md:text-sm"
                  onClick={() => setIsConfirmDelete(true)}
                >
                  Deletar
                </div>
              </div>
            )}
          </div>
          <p className="flex-1 text-xs text-[#848484] md:text-lg">
            {description}
          </p>
          <div className="flex items-center justify-end gap-2 text-sm text-[#F2DAAC] md:text-lg">
            <p className="font-semibold">{formatterPrice(price)}</p>
            <ShoppingBag
              className="size-3.5 cursor-pointer text-white transition-transform hover:scale-115 active:scale-95 md:size-4.5"
              onClick={() => newCartItem()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
