import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  CreditCard,
  QrCode,
  Banknote,
  Coins,
  ScrollText,
  ChefHat,
  ArrowLeft,
  ArrowRight,
  Ticket,
} from "lucide-react";
import { CartItemContext } from "../contexts/CartItemContext";
import { formatterPrice } from "../utils/FormatterPrice";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartItems } = useContext(CartItemContext);
  const { tipoEntrega, observacoes } = location.state || {
    tipoEntrega: "Entrega",
    observacoes: "Nenhuma observação",
  };
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [opcaoEntrega, setOpcaoEntrega] = useState("");
  const [valorTroco, setValorTroco] = useState("");

  async function handleSubmit() {
    try {
      let formaPagamentoFinal = metodoPagamento;
      if (metodoPagamento === "entrega") {
        if (opcaoEntrega === "dinheiro") {
          formaPagamentoFinal = valorTroco
            ? `Dinheiro (Troco para R$ ${valorTroco})`
            : "Dinheiro (Sem troco)";
        } else {
          formaPagamentoFinal = `Na entrega (${opcaoEntrega})`;
        }
      }
      const response = await fetch("http://localhost:3000/createOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          metodoPagamento: formaPagamentoFinal,
          observacoes: observacoes,
          tipoEntrega: tipoEntrega,
          totalFinal: totalFinal,
          opcaoEntrega: opcaoEntrega,
        }),
      });

      if (!response.ok) {
        alert("Erro ao criar o pedido. Tente novamente.");
        return;
      }
      const data = await response.json();
      console.log("Pedido criado com sucesso:", data);
      getCartItems();
      navigate("/");
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao enviar o pedido.");
    }
  }

  const priceTotal = cartItems.reduce(
    (acc, item) => acc + item.productid.price * item.quantity,
    0,
  );
  const priceDelivery = tipoEntrega === "Entrega" ? priceTotal * 0.1 : 0;
  const totalFinal = priceTotal + priceDelivery;

  return (
    <div className="mx-auto mt-5 mb-20 w-full px-3 text-[#F2DAAC] md:w-184.25 md:px-0">
      {/* 1. TÍTULO E SUBTÍTULO */}
      <div className="mb-8">
        <h1 className="font-extrabold uppercase md:text-3xl">Pagamento</h1>
        <p className="mt-1 text-sm text-[#9D9D94]">
          Escolha a forma de pagamento e finalize seu pedido.
        </p>
      </div>
      {/* 2. GRID PRINCIPAL */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* COLUNA DA ESQUERDA (Formas de Pagamento) */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* 1. TÍTULO DA SEÇÃO */}
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
            <CreditCard size={15} />
            <span>Forma de Pagamento</span>
          </div>
          {/* 2. LISTA DE OPÇÕES DE PAGAMENTO */}
          <div className="flex flex-col gap-3">
            {[
              {
                id: "debito",
                nome: "Débito",
                desc: "Pague com seu cartão de débito.",
                Icon: CreditCard,
              },
              {
                id: "credito",
                nome: "Crédito",
                desc: "Pague com seu cartão de crédito.",
                Icon: CreditCard,
              },
              {
                id: "voucher",
                nome: "Voucher",
                desc: "Pague com Vale-Refeição ou Alimentação.",
                Icon: Ticket,
              },
              {
                id: "pix",
                nome: "Pix",
                desc: "Pague de forma rápida e segura.",
                Icon: QrCode,
              },
              {
                id: "entrega",
                nome: "Entrega ou retirada",
                desc: "Pague no momento em que receber o pedido.",
                Icon: Banknote,
              },
            ].map((opcao) => {
              const isSelected = metodoPagamento === opcao.id;
              const IconComponent = opcao.Icon;
              return (
                <div key={opcao.id} className="flex flex-col gap-2">
                  {/* Card da Opção */}
                  <div
                    onClick={() => setMetodoPagamento(opcao.id)}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-[#F2DAAC] bg-[#1a1713]"
                        : "border-[#2d2820] bg-[#161410] hover:border-[#F2DAAC]/40"
                    }`}
                  >
                    {/* Círculo do Radio */}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? "border-[#F2DAAC]" : "border-[#F2DAAC]/40"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#F2DAAC]" />
                      )}
                    </div>
                    <div className="text-[#F2DAAC]">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F2DAAC]">
                        {opcao.nome}
                      </h3>
                      <p className="text-xs text-[#9D9D94]">{opcao.desc}</p>
                    </div>
                  </div>
                  {/* 2. SUBMENU EXPANSÍVEL QUANDO 'PAGAMENTO NA ENTREGA' ESTIVER SELECIONADO */}
                  {opcao.id === "entrega" && isSelected && (
                    <div className="ml-4 flex flex-col gap-3 rounded-xl border border-[#F2DAAC]/20 bg-[#14120e] p-4">
                      <p className="text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
                        Escolha como pagar:
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          {
                            id: "cartao_debito_entrega",
                            label: "Cartão de Débito",
                          },
                          {
                            id: "cartao_credito_entrega",
                            label: "Cartão de Crédito",
                          },
                          { id: "voucher_entrega", label: "Voucher" },
                          { id: "dinheiro_entrega", label: "Dinheiro" },
                        ].map((sub) => (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => setOpcaoEntrega(sub.id)}
                            className={`cursor-pointer rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                              opcaoEntrega === sub.id
                                ? "border-[#F2DAAC] bg-[#F2DAAC] text-[#161410]"
                                : "border-[#2d2820] bg-[#1a1713] text-[#F2DAAC] hover:border-[#F2DAAC]/40"
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                      {/* 3. CAMPO DE TROCO: APARECE SE ESCOLHER 'DINHEIRO' */}
                      {opcaoEntrega === "dinheiro_entrega" && (
                        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#2d2820] bg-[#1a1713] p-3">
                          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
                            <Coins size={14} />
                            <span>Precisa de troco para quanto?</span>
                          </div>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              value={valorTroco}
                              onChange={(e) => setValorTroco(e.target.value)}
                              placeholder="Ex: 50,00"
                              className="h-10 w-full rounded-lg border border-[#F2DAAC]/30 bg-transparent px-3 text-xs text-[#F2DAAC] placeholder-[#6b665c] focus:border-[#F2DAAC] focus:outline-none"
                            />
                            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-[#9D9D94]">
                              R$
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* COLUNA DA DIREITA (Resumo do Pedido Compacto) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-4 rounded-xl border border-[#F2DAAC]/30 bg-[#161410] p-5 shadow-md">
            {/* Título com Ícone */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
              <ScrollText size={15} />
              <span>Resumo do Pedido</span>
            </div>
            {/* Lista Compacta de Produtos */}
            <div className="flex max-h-60 scrollbar-thin scrollbar-thumb-[#F2DAAC]/40 scrollbar-track-transparent flex-col gap-3 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  {/* Foto + Nome + Quantidade */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productid.img}
                      alt={item.productid.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="line-clamp-1 text-xs font-bold text-[#F2DAAC] uppercase">
                        {item.productid.name}
                      </p>
                      <span className="text-xs text-[#9D9D94]">
                        {item.quantity}x
                      </span>
                    </div>
                  </div>
                  {/* Preço do item */}
                  <span className="text-xs font-bold text-[#F2DAAC]">
                    {formatterPrice(item.productid.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            {/* Divisória */}
            <div className="h-[1px] w-full bg-[#F2DAAC]/20" />
            {/* Subtotal e Taxa */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold text-[#F2DAAC]">
                  {formatterPrice(priceTotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Taxa de entrega</span>
                <span className="font-semibold text-[#F2DAAC]">
                  {formatterPrice(priceDelivery)}
                </span>
              </div>
              <div className="flex flex-col justify-between border-0 border-t border-[#F2DAAC]/20 pt-2 text-gray-300">
                <span className="mt-1 font-semibold text-[#F2DAAC]">
                  Observações
                </span>
                <span className="mt-1">
                  {observacoes || "Nenhuma observação"}
                </span>
              </div>
            </div>
            {/* Divisória */}
            <div className="h-[1px] w-full bg-[#F2DAAC]/20" />
            {/* Total Geral */}
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm">Total</span>
              <span className="text-lg font-extrabold text-[#F2DAAC]">
                {formatterPrice(totalFinal)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 3. RODAPÉ */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2d2820] pt-6 sm:flex-row">
        <Link
          to="/OrderReview"
          className="flex cursor-pointer items-center gap-2 text-sm text-[#F2DAAC] hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Voltar para o resumo do pedido</span>
        </Link>
        <button
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F2DAAC] px-8 py-3.5 text-sm font-bold text-[#161410] transition hover:bg-[#e4cb9c]"
          onClick={handleSubmit}
        >
          <ChefHat size={18} />
          <span>Enviar pedido para a cozinha</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Payment;
