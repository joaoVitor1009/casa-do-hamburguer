import { useState } from "react";
import { formatterPrice } from "../utils/FormatterPrice";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  MessageSquare,
  X,
  FileText,
} from "lucide-react";
import type { ProductInterface } from "../types/Product";
import type { UserInterface } from "../types/User";
import OrderReceipt from "./OrderReceipt";

type ItemPedido = {
  id?: string;
  createdAt?: Date;
  formaPagamento?: string;
  observacao?: string;
  status?: string;
  tipoEntrega?: string;
  total?: number;
  item?: {
    id: string;
    price: number;
    product: ProductInterface;
    quantity: number;
  }[];
  user?: UserInterface | null;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const statusStyle: Record<string, string> = {
  Concluido: "bg-green-600/20 text-green-400",
  Cancelado: "bg-red-600/20 text-red-400",
};

const CartMyOrders = ({
  createdAt,
  formaPagamento,
  id,
  observacao,
  status,
  tipoEntrega,
  total,
  item,
  user,
  setShowCart,
}: ItemPedido) => {
  const [showReceipt, setShowReceipt] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div
        className="max-h-[85vh] w-full max-w-lg scrollbar-thin scrollbar-thumb-[#F2DAAC]/40 scrollbar-track-transparent overflow-y-auto rounded-2xl border border-[#F2DAAC]/25 bg-[#1B1915] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-[#F2DAAC]/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#F2DAAC]">Pedido</h2>
            <p className="mt-1 text-sm text-[#9D9D94]">{id?.slice(0, 5)}</p>
          </div>

          <button
            className="rounded-full p-2 text-[#F2DAAC] hover:bg-white/10"
            aria-label="Fechar"
            onClick={() => setShowCart(false)}
          >
            <X size={22} />
          </button>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyle[status ? status : ""] || "bg-gray-500/20 text-gray-300"
          }`}
        >
          {status}
        </span>

        <h3 className="mt-5 mb-3 font-semibold text-[#F2DAAC]">Produtos</h3>

        {item && item.length > 0 ? (
          <div className="space-y-4">
            {item.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b border-[#F2DAAC]/10 pb-4"
              >
                <img
                  src={item.product.img}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg bg-[#29251E] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white">
                    {item.product.name}
                  </h4>
                  <p className="mt-1 text-xs text-[#9D9D94]">
                    {item.product.description}
                  </p>
                  <p className="mt-2 text-sm text-[#F2DAAC]">
                    {item.quantity}x {formatterPrice(item.product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#9D9D94]">
            Nenhum produto disponível para exibição.
          </p>
        )}

        <div className="mt-5 items-center justify-center space-y-3 border-b border-[#F2DAAC]/20 pb-5 text-sm">
          <div className="flex items-center gap-2 text-[#9D9D94]">
            <CalendarDays size={17} />
            <span>{createdAt?.toString().slice(0, 10)}</span>
          </div>

          <div className="flex items-center gap-2 text-[#9D9D94]">
            <MapPin size={17} />
            <span>
              {tipoEntrega === "retirar"
                ? "Retirar na loja"
                : `CEP de entrega: ${user?.cep}`}
            </span>
          </div>
          <div className="border border-[#F2DAAC]/15 bg-[#201D17] p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CreditCard size={16} className="mt-0.5 text-[#F2DAAC]" />

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#9D9D94]">
                    Forma de pagamento
                  </span>
                  <span className="text-sm font-medium text-[#F2DAAC]">
                    {formaPagamento}
                  </span>
                </div>
              </div>

              {observacao && (
                <div className="flex items-start gap-3">
                  <MessageSquare
                    size={16}
                    className="mt-0.5 shrink-0 text-[#F2DAAC]"
                  />

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#9D9D94]">Observações</span>
                    <span className="text-sm leading-relaxed text-[#F2DAAC]">
                      {observacao}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <span className="font-semibold text-white">Total do pedido</span>
          <span className="text-xl font-bold text-[#F2DAAC]">
            {formatterPrice(total ? total : 0)}
          </span>
        </div>
        {status !== "Cancelado" && (
          <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#F2DAAC] py-3 text-sm font-bold text-[#161410] transition hover:bg-[#e5c98f]"
            onClick={() => setShowReceipt(true)}
          >
            <FileText size={18} />
            <span>Comprovante</span>
          </button>
        )}

        {showReceipt && status !== "Cancelado" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="flex max-h-[90vh] flex-col items-center gap-4 overflow-y-auto">
              <OrderReceipt
                id={id || ""}
                total={total || 0}
                tipoEntrega={tipoEntrega || ""}
                formaPagamento={formaPagamento || ""}
                observacao={observacao || ""}
                createdAt={createdAt || new Date()}
                items={item || []}
              />
              <div className="flex w-full justify-between gap-3">
                <button
                  className="rounded-lg bg-neutral-700 px-4 py-2 font-bold text-white"
                  onClick={() => setShowReceipt(false)}
                >
                  Voltar
                </button>
                <button
                  className="rounded-lg bg-[#F2DAAC] px-4 py-2 font-bold text-[#161410]"
                  onClick={() => window.print()}
                >
                  Imprimir / Salvar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartMyOrders;
