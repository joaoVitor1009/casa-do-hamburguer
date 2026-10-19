import { useEffect, useState } from "react";
import Button from "../components/Button";

import CardOrder from "../components/CarOrder";
import { base, formatterPrice } from "../utils/FormatterPrice";
import type { UserInterface } from "../types/User";
import type { ProductInterface } from "../types/Product";
import { Calendar, X, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

type cardOrderType = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  userId: string;
  user: UserInterface;
  deliveredTime: string | null;

  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;

  items: {
    id: string;
    quantity: number;
    price: number;
    product: ProductInterface;
  }[];
};

const Orders = () => {
  const [category, setCategory] = useState("Pendente");
  const [selectedDate, setSelectedDate] = useState("");
  const [cardOrder, setCardOrder] = useState<cardOrderType[]>([]);

  const handleChangeCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  const getCategory = (categoryName: string) => {
    const elementoSelecionado = "forty";

    const elementoNãoSelecionado = "thirty";

    if (category === categoryName) {
      return elementoSelecionado;
    } else {
      return elementoNãoSelecionado;
    }
  };

  async function getOrders() {
    const response = await fetch(base + "getOrders", {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ao buscar pedidos:");
      setCardOrder([]);
      return;
    }
    console.log(data);
    setCardOrder(data);
  }

  const filteredOrders = cardOrder.filter((items) => {
    const matchesStatus = items.status === category;
    const orderDate = new Date(items.createdAt).toLocaleDateString("en-CA");
    const matchesDate = selectedDate ? orderDate === selectedDate : true;

    return matchesStatus && matchesDate;
  });

  const handleExportExcel = () => {
    const ordersToExport = cardOrder.filter((item) => {
      if (!selectedDate) return true;
      const orderDate = new Date(item.createdAt).toLocaleDateString("en-CA");
      return orderDate === selectedDate;
    });

    if (ordersToExport.length === 0) {
      toast.error("Nenhum pedido localizado na data informada ");
      return;
    }

    const dataToExport = ordersToExport.map((order, index) => {
      const orderDate = new Date(order.createdAt);
      const dataFormatada = orderDate.toLocaleDateString("pt-BR");
      const horaFormatada = orderDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const itensFormatados =
        order.items
          ?.map((item) => `${item.quantity}x ${item.product.name}`)
          .join(", ") || "Sem itens";

      return {
        Nº: index + 1,
        "Código Pedido": `#${order.id.slice(0, 5)}`,
        Cliente: order.user?.name || "Não informado",
        Data: dataFormatada,
        Hora: horaFormatada,
        Status: order.status,
        "Itens do Pedido": itensFormatados,
        "Tipo de Entrega":
          order.tipoEntrega === "retirar" ? "Retirar na loja" : "Delivery",
        "Forma de Pagamento": order.formaPagamento,
        Observação: order.observacao || "Nenhuma",
        "Total (R$)": Number(order.total),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    const fileName = selectedDate
      ? `pedidos_${selectedDate}.xlsx`
      : "todos_os_pedidos.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    getOrders();

    const eventSource = new EventSource(base + "admin-events", {
      withCredentials: true,
    });

    eventSource.onmessage = () => {
      getOrders();
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE do Admin:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="mx-auto mt-5 w-[93%] px-3 text-[#F2DAAC] md:w-184.25 md:px-0">
      {/* Categorias */}
      <div className="flex flex-col items-center gap-1 py-3">
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-2">
          <Button
            title="Pendente"
            variant={getCategory("Pendente")}
            onClick={() => handleChangeCategory("Pendente")}
          />
          <Button
            title="Preparando"
            variant={getCategory("Preparando")}
            onClick={() => handleChangeCategory("Preparando")}
          />
          <Button
            title="Retirado"
            variant={getCategory("Retirado")}
            onClick={() => handleChangeCategory("Retirado")}
          />
          <Button
            title="Concluido"
            variant={getCategory("Concluido")}
            onClick={() => handleChangeCategory("Concluido")}
          />
          <Button
            title="Cancelado"
            variant={getCategory("Cancelado")}
            onClick={() => handleChangeCategory("Cancelado")}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
          <div className="flex items-center gap-2 rounded-lg border border-[#F2DAAC]/30 bg-[#161410] px-3 py-1.5 text-xs text-[#F2DAAC]">
            <Calendar size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-[#F2DAAC] [color-scheme:dark] outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="cursor-pointer text-[#9D9D94] hover:text-[#F2DAAC]"
                title="Limpar filtro de data"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-lg border border-[#F2DAAC]/30 bg-[#161410] px-3 py-1.5 text-xs font-bold text-[#F2DAAC] transition hover:border-[#F2DAAC] hover:bg-[#F2DAAC]/10"
            title="Exportar pedidos para Excel"
          >
            <FileSpreadsheet size={16} className="text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
        {filteredOrders.map((items) => {
          const date = new Date(items.createdAt);

          let deliveredTime;
          if (items.deliveredTime === null) {
            deliveredTime = "--";
          } else {
            deliveredTime = new Date(items.deliveredTime);
            const hoursDelivered = deliveredTime.getHours();
            const formattedHoursDelivered =
              hoursDelivered < 10 ? `0${hoursDelivered}` : hoursDelivered;
            const minutesDelivered = deliveredTime.getMinutes();
            const formattedMinutesDelivered =
              minutesDelivered < 10 ? `0${minutesDelivered}` : minutesDelivered;
            deliveredTime = `${formattedHoursDelivered}:${formattedMinutesDelivered}`;
          }
          const day = date.getDate();
          const formattedDay = day < 10 ? `0${day}` : day;
          const month = date.getMonth() + 1;
          const formattedMonth = month < 10 ? `0${month}` : month;
          const year = date.getFullYear();

          const hours = date.getHours();
          const formattedHours = hours < 10 ? `0${hours}` : hours;
          const minutes = date.getMinutes();
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

          const formattedTime = `${formattedHours}:${formattedMinutes}`;
          const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

          const position = cardOrder.findIndex((item) => item.id === items.id);

          return (
            <CardOrder
              id={items.id}
              name={items.user.name}
              date={formattedDate}
              orderTime={formattedTime}
              deliveredTime={deliveredTime}
              total={items.total}
              status={items.status}
              contador={position + 1}
              tipoEntrega={items.tipoEntrega}
              formaPagamento={items.formaPagamento}
              observacao={items.observacao}
              items={items.items}
              getOrders={getOrders}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
