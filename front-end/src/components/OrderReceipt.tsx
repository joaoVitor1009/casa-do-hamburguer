import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import type { ProductInterface } from "../types/Product";
import { formatterPrice } from "../utils/FormatterPrice";

type OrderReceiptProps = {
  id: string;
  total: number;
  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;
  createdAt: Date;
  items: {
    price: number;
    quantity: number;
    product: ProductInterface;
  }[];
};

const OrderReceipt = ({
  id,
  total,
  tipoEntrega,
  formaPagamento,
  observacao,
  createdAt,
  items,
}: OrderReceiptProps) => {
  const { user } = useContext(UserContext);

  return (
    <div
      id="recibo-impressao"
      className="w-[320px] border border-neutral-300 bg-[#FEFEE2] p-4 font-mono text-[11px] leading-tight text-black shadow-md"
    >
      {/* 1. CABEÇALHO DA EMPRESA */}
      <div className="text-center">
        <h1 className="text-base font-extrabold tracking-wide uppercase">
          CASA DO HAMBÚRGUER
        </h1>
        <p className="text-[10px] font-semibold uppercase">
          CASA DO HAMBURGUER COM. DE ALIMENTOS LTDA
        </p>
        <p className="text-[10px]">Rua dos Hamburgueres, 123 - Centro</p>
        <p className="text-[10px]">CEP: 04814-630 - São Paulo/SP</p>
        <p className="text-[10px]">(11) 99999-9999 / (11) 3333-3333</p>
        <div className="mt-1 flex justify-between px-1 text-[10px]">
          <span>CNPJ: 11.111.111/0001-11</span>
          <span>IE: 11.222.333</span>
        </div>
      </div>

      {/* 2. DADOS DO CLIENTE */}
      <div className="mt-2 border-t border-black pt-1">
        <p className="font-semibold uppercase">
          CLIENTE: {user?.name || "NOME DO CLIENTE"}
        </p>
      </div>

      {/* 3. DATA/HORA E Nº DO COMPROVANTE */}
      <div className="mt-1 flex items-end justify-between text-[10px]">
        <div>
          {/* COLOQUE A VARIÁVEL DE DATA E HORA AQUI */}
          <span>
            {new Date(createdAt).toLocaleDateString()}{" "}
            {new Date(createdAt).toLocaleTimeString()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[8px] leading-none font-bold uppercase">
            COMPROVANTE DE VENDA
          </p>
          <p className="mt-0.5 text-sm leading-none font-extrabold">
            Nº {id.slice(0, 5).toUpperCase()}
          </p>
        </div>
      </div>

      {/* LINHA DIVISÓRIA */}
      <div className="my-1.5 border-b-2 border-black" />

      {/* 4. CABEÇALHO DA TABELA DE ITENS */}
      <div className="mb-1 flex justify-between border-b border-black pb-0.5 font-bold">
        <span className="w-12">CÓDIGO</span>
        <span className="flex-1 text-left">DESCRIÇÃO / QTD x UNIT</span>
        <span className="w-14 text-right">R$ VALOR</span>
      </div>

      {/* 5. LISTAGEM DE ITENS (AQUI VOCÊ FARÁ O ITEMS.MAP) */}

      <div className="flex flex-col gap-1 py-1">
        {items.map((item, index) => (
          // Variável contador para exibir o número do item

          <div className="flex flex-col" key={item.product.id}>
            <div className="flex justify-between">
              <span className="w-12 font-semibold">{index + 1}</span>
              <span className="flex-1 font-bold uppercase">
                {item.product.name}
              </span>
              <span className="w-14 text-right font-semibold">
                {formatterPrice(item.price * item.quantity)}
              </span>
            </div>
            <div className="flex justify-between pl-12 text-[10px] text-neutral-700">
              <span>
                {item.quantity} x {formatterPrice(item.price)}
              </span>
            </div>
          </div>
        )) || (
          <p className="text-[10px] text-neutral-500">
            Nenhum item adicionado.
          </p>
        )}
      </div>

      {/* LINHA DIVISÓRIA */}
      <div className="my-1.5 border-b-2 border-black" />

      {/* 6. TOTAIS E VALORES */}
      <div className="flex flex-col gap-0.5 font-bold">
        <div className="flex justify-between">
          <span>Total da Nota R$</span>
          <span>{formatterPrice(total)}</span>
        </div>
        <div className="flex justify-between text-neutral-800">
          <span>Tipo de Entrega:</span>
          <span className="font-semibold uppercase">
            {tipoEntrega === "entrega" ? "ENTREGA" : "RETIRADA"}
          </span>
        </div>
      </div>

      {/* LINHA DIVISÓRIA */}
      <div className="my-1.5 border-b border-black" />

      {/* 7. FORMA DE PAGAMENTO */}
      <div>
        <p className="font-bold uppercase">
          FORMA DE PGTO: {formaPagamento?.toUpperCase()}
        </p>
        <div className="mt-1 flex justify-between border-t border-black/40 pt-1 text-[10px]">
          <span>DATA PGTO</span>
          <span>R$ VALOR</span>
          <span>TIPO PGTO</span>
        </div>
        <div className="flex justify-between text-[10px] font-semibold">
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span>{formatterPrice(total)}</span>
          <span className="uppercase">{formaPagamento?.toUpperCase()}</span>
        </div>
      </div>

      {/* 8. OBSERVAÇÃO (SE HOUVER) */}
      <div className="mt-2 border-t border-black pt-1">
        <p className="font-semibold">OBSERVAÇÕES:</p>
        <p className="text-[10px] italic">
          {observacao || "Nenhuma observação informada."}
        </p>
      </div>

      {/* LINHA DIVISÓRIA */}
      <div className="my-2 border-b-2 border-black" />

      {/* 9. TERMO DE RECEBIMENTO E ASSINATURA */}
      <div className="mt-2 px-2 text-center">
        <p className="text-[9px] leading-tight">
          Recebi a(s) mercadoria(s) acima descrita(s), concordando plenamente
          com os itens e valores entregues.
        </p>
        <div className="mx-auto mt-6 w-3/4 border-b border-dashed border-black" />
        <p className="mt-1 text-[9px] font-bold uppercase">
          ASSINATURA DO CLIENTE
        </p>
      </div>

      {/* LINHA DIVISÓRIA */}
      <div className="my-2 border-b border-black" />

      {/* 10. MENSAGEM FINAL */}
      <div className="py-1 text-center text-[10px] font-bold tracking-wider">
        * OBRIGADO E VOLTE SEMPRE *
      </div>
    </div>
  );
};

export default OrderReceipt;
