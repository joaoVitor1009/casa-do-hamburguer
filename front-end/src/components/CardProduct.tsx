import { Plus, X } from "lucide-react";
import Button from "./Button";
import { useRef, useState } from "react";

type cardProductTypes = {
  setShowCartProduct: React.Dispatch<React.SetStateAction<boolean>>;
  showCartProduct: boolean;
};

const CardProduct = ({
  setShowCartProduct,
  showCartProduct,
}: cardProductTypes) => {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>();
  const [productImage, setProductImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("category", productCategory);
      formData.append("price", String(productPrice));

      if (productImage) {
        formData.append("image", productImage);
      }

      const response = await fetch("http://localhost:3000/createProduct", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();

        console.log("Erro ao adicionar produto:", error);

        return;
      }

      const data = await response.json();
      alert("Produto adicionado com sucesso!");
      console.log(data);

      setShowCartProduct(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 flex h-[283px] w-[660px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-[#24211d] p-1 text-[#9D9D94]">
      {/* Header */}
      <div className="flex p-1">
        <div className="flex flex-1 justify-center text-lg">
          <p>Adicionar produto</p>
        </div>

        <div className="flex">
          <X
            className="cursor-pointer"
            onClick={() => setShowCartProduct(false)}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-col">
        <div className="mx-auto flex-col">
          {/* Conteúdo */}
          <div className="flex w-full items-center justify-center gap-5">
            {/* Imagem */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setProductImage(file);
                    console.log(file);
                  }
                }}
              />

              <div
                className="flex h-[166px] w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-md border border-[#9D9D94]"
                onClick={() => fileInputRef.current?.click()}
              >
                {productImage ? (
                  <img
                    src={URL.createObjectURL(productImage)}
                    alt="Imagem do produto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Plus className="size-11" />
                )}
              </div>
            </div>
            {/* Campos */}
            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Nome do produto"
                className="h-[33px] w-[402px] rounded-sm border border-[#9D9D94] px-2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Descrição"
                className="h-[33px] w-[402px] rounded-sm border border-[#9D9D94] px-2"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />

              <select
                className="h-[33px] w-[402px] cursor-pointer rounded-sm border border-[#9D9D94] px-2"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="" disabled>
                  Categoria
                </option>

                <option value="Burgers">Hamburguer</option>

                <option value="Bebida">Bebida</option>

                <option value="Porções">Porção</option>
              </select>

              <input
                type="number"
                placeholder="Preço"
                className="h-[33px] w-[402px] rounded-sm border border-[#9D9D94] px-2"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Botão */}
          <div className="mt-3.5" onClick={handleAddProduct}>
            <Button title="Adicionar produto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
