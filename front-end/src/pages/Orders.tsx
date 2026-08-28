import { useState } from "react";
import Button from "../components/Button";

import CardOrder from "../components/CarOrder";

const Orders = () => {
  const [category, setCategory] = useState("Pendente");

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
          onClick={() => handleChangeCategory("Candelado")}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <CardOrder
          id={2}
          name="João Vitor Souza"
          date="27/12/2026"
          orderTime="20:40"
          deliveredTime="21:47"
          total={124.75}
        />
      </div>
    </div>
  );
};

export default Orders;
