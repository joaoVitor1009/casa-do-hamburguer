import { User, CalendarFold, Clock, ClockCheck } from "lucide-react";

type cardPedidoType = {
  id: number;
  name: string;
  date: string;
  orderTime: string;
  deliveredTime?: string;
  total: number;
};

const CardOrder = ({
  id,
  name,
  date,
  orderTime,
  deliveredTime,
  total,
}: cardPedidoType) => {
  return (
    <div className="rounded-md bg-[#F2DAAC] p-2 text-[#32343E]">
      <div className="flex justify-between text-[#161410]">
        <p className="font-bold">#{id}</p>
        <select name="" id="" className="font-bold">
          <option value="" defaultChecked disabled>
            Pendente
          </option>
          <option value="">Retirado</option>
          <option value="">Cancelado</option>
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
            <p className="text-xs">{deliveredTime ? deliveredTime : "--"}</p>
          </div>
        </div>

        <div className="mt-1.5 h-0.5 w-full bg-[#161410]"></div>

        <p className="text-right text-lg font-bold text-[#32343E]">R${total}</p>
      </div>
    </div>
  );
};

export default CardOrder;
