import { User, CalendarFold, Clock, ClockCheck } from "lucide-react";
import { base, formatterPrice } from "../utils/FormatterPrice";

type cardPedidoType = {
  id: string;
  name: string;
  date: string;
  orderTime: string;
  deliveredTime: string;
  total: number;
  status: string;
  contador: number;
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
  getOrders,
}: cardPedidoType) => {
  async function handleUpdateStatus(novoStatus: string) {
    const response = await fetch(base + `updateStatus/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (response.ok) {
      getOrders();
      return;
    }
  }

  return (
    <div className="rounded-md bg-[#F2DAAC] p-2 text-[#32343E]">
      <div className="flex justify-between text-[#161410]">
        <p className="font-bold">#{contador}</p>

        <select
          className="font-bold"
          value={status}
          onChange={(e) => {
            handleUpdateStatus(e.target.value);
          }}
        >
          <option value="Pendente">Pendente</option>
          <option value="Retirado">Retirado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User size={16} />
          <p className="text-xs">{name}</p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarFold size={16} />
          <p className="text-xs">{date}</p>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <p className="text-xs">{orderTime}</p>
          </div>

          <div className="flex items-center gap-2">
            <ClockCheck size={16} />
            <p className="text-xs">{deliveredTime}</p>
          </div>
        </div>

        <div className="mt-1.5 h-0.5 w-full bg-[#161410]"></div>

        <p className="text-right text-lg font-bold text-[#32343E]">
          {formatterPrice(total)}
        </p>
      </div>
    </div>
  );
};

export default CardOrder;
