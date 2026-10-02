import {
  User,
  CalendarFold,
  CircleDollarSign,
  Motorbike,
  Logs,
  Clock,
  ClockCheck,
  MessageSquare,
} from "lucide-react";

import { base, formatterPrice } from "../utils/FormatterPrice";
import type { ProductInterface } from "../types/Product";

type cardPedidoType = {
  id: string;
  name: string;
  date: string;
  orderTime: string;
  deliveredTime: string;
  total: number;
  status: string;
  contador: number;
  tipoEntrega: string;
  formaPagamento: string;
  observacao?: string;

  items: {
    id: string;
    quantity: number;
    price: number;
    product: ProductInterface;
  }[];

  getOrders: () => Promise<void>;
};

const CardOrder = ({
  id,
  name,
  date,
  orderTime,
  deliveredTime,
  total,
  status,
  contador,
  tipoEntrega,
  formaPagamento,
  observacao,
  items,
  getOrders,
}: cardPedidoType) => {
  async function handleUpdateStatus(novoStatus: string) {
    const response = await fetch(base + `updateStatus/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        status: novoStatus,
      }),
    });

    if (response.ok) {
      getOrders();
    }
  }

  return (
    <div className="rounded-lg border border-[#F2DAAC] bg-[#161410] p-2.5 text-[#F2DAAC]">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between">
        <p className="text-base font-bold">
          #{contador}, Pedido: {id.slice(0, 5)}
        </p>

        <select
          className="cursor-pointer rounded-md bg-[#F2DAAC] px-2.5 py-1 text-xs font-bold text-[#161410] outline-none"
          value={status}
          onChange={(e) => handleUpdateStatus(e.target.value)}
        >
          <option value="Pendente">Pendente</option>
          <option value="Preparando">Preparando</option>
          <option value="Retirado">Retirado</option>
          <option value="Concluido">Concluido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* CONTEÚDO */}
      <div className="mt-2.5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* INFORMAÇÕES */}
        <div className="flex flex-col gap-2 border-b border-[#F2DAAC]/40 pb-2.5 md:border-r md:border-b-0 md:pr-3">
          <div className="flex items-center gap-2">
            <User size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Cliente</p>
              <p className="text-xs text-white">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarFold size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Data</p>
              <p className="text-xs text-white">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CircleDollarSign size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Pagamento</p>
              <p className="text-xs text-white">{formaPagamento}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Motorbike size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Entrega</p>
              <p className="text-xs text-white">{tipoEntrega}</p>
            </div>
          </div>
        </div>

        {/* ITENS */}
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-2">
            <Logs size={16} />

            <p className="text-xs font-medium">Itens do pedido</p>
          </div>

          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-xs text-white uppercase">
                  {item.product.name}
                </p>

                <p className="text-xs font-bold">{item.quantity}x</p>
              </div>
            ))}
          </div>

          {/* OBSERVAÇÃO */}
          {observacao !== "Nenhuma Observação" && (
            <div className="mt-3 flex gap-2">
              <MessageSquare size={16} />

              <div>
                <p className="text-[9px] text-[#9D9D94]">Observação</p>

                <p className="text-xs text-white">{observacao}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LINHA */}
      <div className="my-2.5 h-px w-full bg-[#F2DAAC]/60" />

      {/* RODAPÉ */}
      <div className="flex items-center justify-between">
        {/* HORÁRIOS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Pedido</p>

              <p className="text-xs text-white">{orderTime}</p>
            </div>
          </div>

          <div className="h-6 w-px bg-[#F2DAAC]/40" />

          <div className="flex items-center gap-1.5">
            <ClockCheck size={16} />

            <div>
              <p className="text-[9px] text-[#9D9D94]">Alterado</p>

              <p className="text-xs text-white">{deliveredTime}</p>
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="text-right">
          <p className="text-[9px] text-[#9D9D94]">Total</p>

          <p className="text-base font-bold">{formatterPrice(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardOrder;
