import { API_URL } from "../utils/api";
import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Product from "../components/Product";
import type { ProductInterface } from "../types/Product";

const home = () => {
  const [category, setCategory] = useState("Burgers");
  const [product, setProduct] = useState<ProductInterface[]>([]);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);

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

  const preloadAllImages = (products: ProductInterface[]) => {
    const loadedImages: HTMLImageElement[] = [];

    products.forEach((p) => {
      if (!p.img) return;

      const img = new Image();
      const imageUrl = p.img.startsWith("http")
        ? p.img
        : p.img.startsWith("/")
          ? p.img
          : `/${p.img}`;

      img.src = imageUrl;
      // img.decode() força o download e a descompactação na placa de vídeo na hora!
      img.decode().catch(() => {});
      loadedImages.push(img);
    });

    // Mantém as instâncias vivas na memória RAM
    preloadedImagesRef.current = loadedImages;
  };

  const getProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/getProduct`);

      if (!response.ok) {
        setProduct([]);
        return;
      }

      const data = await response.json();
      setProduct(data);
      preloadAllImages(data);
    } catch (e) {
      console.log(e);
      return;
    }
  };

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

      <p
        key={category}
        className="mt-2 mb-2 text-[14px] font-bold uppercase animate-fade-in md:text-[18px]"
      >
        {category}
      </p>
      <div className="flex flex-col gap-3 md:gap-3">
        {product.map((item) => (
          <div
            key={item.id}
            className={
              item.category === category ? "block animate-fade-in" : "hidden"
            }
          >
            <Product
              description={item.description}
              id={item.id}
              img={item.img}
              name={item.name}
              price={item.price}
              category={item.category}
              getProducts={getProduct}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default home;
