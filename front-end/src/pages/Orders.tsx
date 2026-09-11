import { useEffect, useState } from "react";
import Button from "../components/Button";

import CardOrder from "../components/CarOrder";
import { base } from "../utils/FormatterPrice";
import type { UserInterface } from "../types/User";

type cardOrderType = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  userId: string;
  user: UserInterface;
  deliveredTime: string | null;
};

const Orders = () => {
  const [category, setCategory] = useState("Pendente");
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
    return items.status === category;
  });

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="mx-auto w-[93%] px-3 text-[#F2DAAC] md:w-184.25 md:px-0">
      {/* Categorias */}
      <div className="flex justify-center gap-2 py-4 md:justify-start md:py-3">
        <Button
          title="Pendente"
          variant={getCategory("Pendente")}
          onClick={() => handleChangeCategory("Pendente")}
        />
        <Button
          title="Retirado"
          variant={getCategory("Retirado")}
          onClick={() => handleChangeCategory("Retirado")}
        />
        <Button
          title="Cancelado"
          variant={getCategory("Cancelado")}
          onClick={() => handleChangeCategory("Cancelado")}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
              getOrders={getOrders}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
