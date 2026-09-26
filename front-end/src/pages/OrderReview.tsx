import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Minus,
  Plus,
  Trash2,
  Home as HomeIcon,
  ChevronRight,
  ScrollText,
  Truck,
  ArrowLeft,
  ArrowRight,
  Store,
} from "lucide-react";
import { CartItemContext } from "../contexts/CartItemContext";
import { formatterPrice, base } from "../utils/FormatterPrice";
import type { CartItemsTypeContext } from "../types/CartItem";
import { CartOrderReview } from "../components/CartOrderReview";

const OrderReview = () => {
  const { cartItems } = useContext(CartItemContext);
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirar">(
    "entrega",
  );

  const [observacoes, setObservacoes] = useState("");

  const navigate = useNavigate();

  const priceTotal = cartItems.reduce(
    (acc, item) => acc + item.productid.price * item.quantity,
    0,
  );

  const priceDelivery = () => {
    if (tipoEntrega === "entrega") {
      return priceTotal * 0.1;
    }
    return 0;
  };

  return (
    <div className="mx-auto mt-5 mb-20 w-full px-3 text-[#F2DAAC] md:w-184.25 md:px-0">
      <div className="mb-8">
        <h1 className="font-extrabold uppercase md:text-3xl">
          Revisão do Pedido
        </h1>
        <p className="mt-1 text-sm text-[#9D9D94]">
          Confira os itens do seu pedido antes de finalizar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {cartItems.length === 0 ? (
            <p className="text-sm text-[#9D9D94]">Carrinho vazio</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartOrderReview
                  key={item.id}
                  img={item.productid.img}
                  title={item.productid.name}
                  description={item.productid.description}
                  price={item.productid.price}
                  id={item.productid.id}
                  quantity={item.quantity}
                />
              ))}
            </>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-5 rounded-xl border border-[#F2DAAC] bg-[#161410] p-6 shadow-md">
            <p className="text-sm font-bold tracking-wider text-[#F2DAAC] uppercase">
              Resumo do pedido
            </p>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal: </span>
                <span className="font-semibold text-[#F2DAAC]">
                  {formatterPrice(priceTotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Taxa de entrega</span>
                <span className="font-semibold text-[#F2DAAC]">
                  {formatterPrice(priceDelivery())}
                </span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#F2DAAC]/20" />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-xl font-extrabold text-[#F2DAAC]">
                {formatterPrice(priceTotal + priceDelivery())}
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
                <Truck size={15} />
                <span>Forma de Entrega</span>
              </div>

              <div className="flex flex-col gap-2">
                {/* OPÇÃO 1: ENTREGA EM CASA */}
                <div
                  onClick={() => setTipoEntrega("entrega")}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                    tipoEntrega === "entrega"
                      ? "border-[#F2DAAC] bg-[#F2DAAC] text-[#161410]"
                      : "border-[#F2DAAC]/30 bg-transparent text-[#F2DAAC] hover:border-[#F2DAAC]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-md border p-2 ${
                        tipoEntrega === "entrega"
                          ? "border-[#161410]/30 text-[#161410]"
                          : "border-[#F2DAAC]/30 text-[#F2DAAC]"
                      }`}
                    >
                      <HomeIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Delivery</p>
                      <p
                        className={`text-[11px] ${
                          tipoEntrega === "entrega"
                            ? "text-[#32343e]"
                            : "text-[#9D9D94]"
                        }`}
                      >
                        Endereço cadastrado
                      </p>
                    </div>
                  </div>
                </div>
                {/* OPÇÃO 2: RETIRAR NA LOJA */}
                <div
                  onClick={() => setTipoEntrega("retirar")}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                    tipoEntrega === "retirar"
                      ? "border-[#F2DAAC] bg-[#F2DAAC] text-[#161410]"
                      : "border-[#F2DAAC]/30 bg-transparent text-[#F2DAAC] hover:border-[#F2DAAC]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-md border p-2 ${
                        tipoEntrega === "retirar"
                          ? "border-[#161410]/30 text-[#161410]"
                          : "border-[#F2DAAC]/30 text-[#F2DAAC]"
                      }`}
                    >
                      <Store size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Retirar na loja</p>
                      <p
                        className={`text-[11px] ${
                          tipoEntrega === "retirar"
                            ? "text-[#32343e]"
                            : "text-[#9D9D94]"
                        }`}
                      >
                        Balcão do restaurante
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
                <ScrollText size={15} />
                <span>Observações</span>
              </div>
              <textarea
                name="observacoes"
                id="observacoes"
                onChange={(e) => setObservacoes(e.target.value)}
                value={observacoes}
                placeholder="Alguma observação? (Opcional)"
                className="h-24 w-full resize-none scrollbar-thin scrollbar-thumb-[#F2DAAC]/40 scrollbar-track-transparent rounded-lg border border-[#F2DAAC]/30 bg-transparent p-3 text-xs text-[#F2DAAC] placeholder-[#6b665c] focus:border-[#F2DAAC] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2d2820] pt-6 sm:flex-row">
        <Link
          to="/"
          className="flex cursor-pointer items-center gap-2 text-sm text-[#F2DAAC] hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Voltar para o cardápio</span>
        </Link>

        <button
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F2DAAC] px-8 py-3.5 text-sm font-bold text-[#161410] transition hover:bg-[#e4cb9c]"
          onClick={() =>
            navigate("/Payment", {
              state: {
                tipoEntrega,
                observacoes,
              },
            })
          }
        >
          <span>Finalizar pedido</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OrderReview;
