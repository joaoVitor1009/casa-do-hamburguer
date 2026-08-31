import { useEffect, useState } from "react";
import Button from "../components/Button";
import Product from "../components/Product";
import type { ProductInterface } from "../types/Product";

const home = () => {
  const [category, setCategory] = useState("Burgers");
  const [product, setProduct] = useState<ProductInterface[]>([]);

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

  const getProduct = async () => {
    try {
      const response = await fetch("http://localhost:3000/getProduct");

      if (!response.ok) {
        setProduct([]);
        return;
      }

      const data = await response.json();
      setProduct(data);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const filteredProduct = product.filter((product) => {
    return product.category === category;
  });

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="mx-auto w-full px-3 text-[#F2DAAC] md:w-184.25 md:px-0">
      <div className="flex justify-center gap-2 py-2 md:justify-start md:py-3">
        <Button
          title="Hamburguers"
          variant={getCategory("Burgers")}
          onClick={() => handleChangeCategory("Burgers")}
        />
        <Button
          title="Bedidas"
          variant={getCategory("Bebida")}
          onClick={() => handleChangeCategory("Bebida")}
        />
        <Button
          title="Porções"
          variant={getCategory("Porções")}
          onClick={() => handleChangeCategory("Porções")}
        />
      </div>

      <p className="mt-2 mb-2 text-[14px] font-bold uppercase md:text-[18px]">
        {category}
      </p>
      <div className="flex flex-col gap-1.5 md:gap-3">
        {filteredProduct.map((product) => (
          <Product
            description={product.description}
            id={product.id}
            img={product.img}
            name={product.name}
            price={product.price}
            category={product.category}
            key={product.id}
            getProducts={getProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default home;
