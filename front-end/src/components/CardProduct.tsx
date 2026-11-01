import { API_URL } from "../utils/api";
import { Plus, X } from "lucide-react";
import Button from "./Button";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductInterface } from "../types/Product";
import { toast } from "sonner";

type cardProductTypes = {
  setShowCartProduct: React.Dispatch<React.SetStateAction<boolean>>;
  showCartProduct: boolean;
  productToEdit?: ProductInterface;
  onSucess?: () => void;
};

const CardProduct = ({
  setShowCartProduct,
  showCartProduct,
  productToEdit,
  onSucess,
}: cardProductTypes) => {
  const [productName, setProductName] = useState<string>(
    productToEdit?.name || "",
  );
  const [productDescription, setProductDescription] = useState<string>(
    productToEdit?.description || "",
  );
  const [productCategory, setProductCategory] = useState<string>(
    productToEdit?.category || "",
  );
  const [productPrice, setProductPrice] = useState<number>(
    productToEdit?.price || 0,
  );
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

      const response = await fetch(`${API_URL}/createProduct`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("Erro ao adicionar produto:", error);
        toast.error("Erro ao adicionar produto");
        return;
      }

      const data = await response.json();
      toast.success("Produto adicionado com sucesso!");
      console.log(data);

      setShowCartProduct(false);
      onSucess?.();
    } catch (e) {
      console.log(e);
      toast.error("Erro ao adicionar produto");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(
        `${API_URL}/updateProduct/${productToEdit?.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productName,
            description: productDescription,
            category: productCategory,
            price: productPrice,
          }),
        },
      );

      if (!response.ok) {
        toast.error("Erro ao atualizar produto");
        return console.log("Erro na requisição");
      }

      setShowCartProduct(false);
      onSucess?.();
      return toast.success("Produto atualizado com sucesso!");
    } catch (e) {
      console.log(e);
      toast.error("Erro ao atualizar produto");
    }
  };

  if (!showCartProduct) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative flex h-auto w-full max-w-[660px] flex-col rounded-xl border border-[#F2DAAC]/20 bg-[#24211d] p-5 text-[#9D9D94] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#9D9D94]/20 pb-3">
          <p className="text-lg font-bold text-white">
            {productToEdit ? "Editar produto" : "Adicionar produto"}
          </p>

          <X
            className="cursor-pointer text-[#9D9D94] transition-colors hover:text-white"
            onClick={() => setShowCartProduct(false)}
          />
        </div>

        <div className="mt-4 flex flex-col">
          <div className="mx-auto flex w-full flex-col">
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
                      alt="Imagem nova"
                      className="h-full w-full object-cover"
                    />
                  ) : productToEdit?.img ? (
                    <img
                      src={
                        productToEdit.img.startsWith("http")
                          ? productToEdit.img
                          : productToEdit.img.startsWith("/")
                            ? productToEdit.img
                            : `/${productToEdit.img}`
                      }
                      alt="Imagem atual"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Plus className="size-11" />
                  )}
                </div>
              </div>

              {/* Campos */}
              <div className="flex flex-1 flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  className="h-[35px] w-full rounded-sm border border-[#9D9D94] px-2 text-white placeholder:text-[#9D9D94]/70"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Descrição"
                  className="h-[35px] w-full rounded-sm border border-[#9D9D94] px-2 text-white placeholder:text-[#9D9D94]/70"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />

                <select
                  className="h-[35px] w-full cursor-pointer rounded-sm border border-[#9D9D94] bg-[#24211d] px-2 text-white"
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
                  className="h-[35px] w-full rounded-sm border border-[#9D9D94] px-2 text-white placeholder:text-[#9D9D94]/70"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Botão */}
            <div
              className="mt-5 flex justify-end"
              onClick={productToEdit ? handleUpdateProduct : handleAddProduct}
            >
              <Button
                title={productToEdit ? "Salvar alterações" : "Adicionar produto"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CardProduct;
