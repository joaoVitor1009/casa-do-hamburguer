import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { UserContext } from "../contexts/UserContext";
import {
  Check,
  ChefHat,
  Clock,
  CookingPot,
  CreditCard,
  HomeIcon,
  MapPin,
  MessageSquare,
  ScrollText,
  Truck,
  X,
} from "lucide-react";
import { formatterPrice } from "../utils/FormatterPrice";
import type { ProductInterface } from "../types/Product";
import type { UserInterface } from "../types/User";

type orderType = {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  userId: string;
  deliveredTime: Date;
  formaPagamento: string;
  tipoEntrega: string;
  observacao: string;
  user: UserInterface;

  items: {
    id: string;
    quantity: number;
    price: number;
    product: ProductInterface;
  }[];
};

const OrderSucess = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { data, cartItems } = location.state || {};
  const [order, setOrder] = useState<orderType | null>(data?.order || null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const loadOrderData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getOrder/${order?.id}`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("aqui esta", { data });
        setOrder(data);
      }
    } catch (error) {
      console.error("Erro ao buscar pedido no reload:", error);
    }
  };

  useEffect(() => {
    if (order?.id) {
      loadOrderData();
    }
  }, [order?.id]);

  useEffect(() => {
    if (!order?.id) return;

    const eventSource = new EventSource(
      `http://localhost:3000/order-events/${order.id}`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setOrder((prevOrder) => ({
        ...prevOrder,
        ...updatedData,
      }));
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão em tempo real:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const etapaAtual = () => {
    switch (order?.status) {
      case "Pendente":
        return -1;

      case "Preparando":
        return 0;

      case "Retirado":
        return 1;

      case "Em Rota":
      case "Em rota":
        return 2;

      case "Concluido":
      case "Concluído":
        return 3;

      default:
        return -1;
    }
  };

  return (
    <div className="mx-auto mt-6 mb-10 w-full max-w-3xl px-4 text-[#F2DAAC]">
      {/* 1. CABEÇALHO DE SUCESSO (10 Segundos) */}
      {showBanner && (
        <div className="flex flex-col items-center text-center transition-all duration-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2DAAC] text-[#161410] shadow-lg">
            <Check size={36} strokeWidth={3} />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-wide uppercase md:text-4xl">
            Pedido Enviado!
          </h1>
          <p className="mt-1 text-sm text-[#9D9D94]">
            Seu pedido foi enviado para a cozinha
          </p>
          <p className="text-xs text-[#9D9D94]">Acompanhe o status abaixo.</p>
        </div>
      )}

      {/* 2. CARD DE INFORMAÇÕES RÁPIDAS */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-[#F2DAAC]/30 bg-[#161410] p-4 sm:grid-cols-3 sm:divide-x sm:divide-[#F2DAAC]/20">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-lg border border-[#F2DAAC]/30 p-2 text-[#F2DAAC]">
            <ScrollText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#9D9D94] uppercase">
              Nº do Pedido
            </p>
            <p className="text-sm font-extrabold text-[#F2DAAC]">
              #{order?.id ? order.id.slice(0, 5) : id ? id.slice(0, 5) : ""}
            </p>
          </div>
        </div>

        {order?.tipoEntrega === "retirar" ? (
          <div className="flex items-center gap-3 px-2 sm:pl-4">
            <div className="rounded-lg border border-[#F2DAAC]/30 p-2 text-[#F2DAAC]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9D9D94] uppercase">
                CEP de retirada
              </p>
              <p className="text-sm font-extrabold text-[#F2DAAC]">04814-630</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 sm:pl-4">
            <div className="rounded-lg border border-[#F2DAAC]/30 p-2 text-[#F2DAAC]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9D9D94] uppercase">
                CEP de Entrega
              </p>
              <p className="text-sm font-extrabold text-[#F2DAAC]">
                {user?.cep || "Sem CEP"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-2 sm:pl-4">
          <div className="rounded-lg border border-[#F2DAAC]/30 p-2 text-[#F2DAAC]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#9D9D94] uppercase">
              Tempo Médio
            </p>
            <p className="text-sm font-extrabold text-[#F2DAAC]">30 - 1 hora</p>
          </div>
        </div>
      </div>

      {/* CARD DE STATUS DO PEDIDO */}
      <div className="mt-6 rounded-xl border border-[#F2DAAC]/30 bg-[#161410] p-6 shadow-md">
        <p className="mb-6 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
          Status do Pedido:{" "}
          {order?.status === "Cancelado" ? (
            <span className="text-red-500">Cancelado</span>
          ) : order?.tipoEntrega === "retirar" ? (
            order?.status === "Retirado" ? (
              <span className="text-amber-400">Retirar no Balcão</span>
            ) : (
              <span className="text-amber-400">{order?.status}</span>
            )
          ) : (
            <span className="text-amber-400">
              {order?.status || "Pendente"}
            </span>
          )}
        </p>

        {order?.status === "Cancelado" ? (
          <div className="my-4 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-500 shadow-md">
              <X size={36} strokeWidth={3} />
            </div>
            <p className="mt-3 text-lg font-bold tracking-wider text-red-500 uppercase">
              Cancelado
            </p>
            <p className="mt-1 text-xs text-[#9D9D94] uppercase">
              Este pedido foi cancelado.
            </p>
          </div>
        ) : order?.tipoEntrega === "retirar" ? (
          <div className="flex items-start justify-between">
            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 0
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <ChefHat size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">
                Preparando
              </p>
              <p className="text-[10px] text-[#9D9D94]">Na cozinha</p>
            </div>

            <div
              className={`mt-6 h-[2px] flex-1 transition-all duration-300 ${
                etapaAtual() >= 1 ? "bg-[#F2DAAC]" : "bg-[#F2DAAC]/30"
              }`}
            />

            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 1
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <CookingPot size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">Retirar</p>
              <p className="text-[10px] text-[#9D9D94]">
                Pode ir retirar no balcão
              </p>
            </div>

            <div
              className={`mt-6 h-[2px] flex-1 transition-all duration-300 ${
                etapaAtual() >= 3 ? "bg-[#F2DAAC]" : "bg-[#F2DAAC]/30"
              }`}
            />

            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 3
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <Check size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">Concluído</p>
              <p className="text-[10px] text-[#9D9D94]">Pedido entregue</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 0
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <ChefHat size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">
                Preparando
              </p>
              <p className="text-[10px] text-[#9D9D94]">Na cozinha</p>
            </div>

            <div
              className={`mt-6 h-[2px] flex-1 transition-all duration-300 ${
                etapaAtual() >= 1 ? "bg-[#F2DAAC]" : "bg-[#F2DAAC]/30"
              }`}
            />

            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 1
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <CookingPot size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">Retirado</p>
              <p className="text-[10px] text-[#9D9D94]">Saiu para entrega</p>
            </div>

            <div
              className={`mt-6 h-[2px] flex-1 transition-all duration-300 ${
                etapaAtual() >= 2 ? "bg-[#F2DAAC]" : "bg-[#F2DAAC]/30"
              }`}
            />

            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 2
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <Truck size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">Em rota</p>
              <p className="text-[10px] text-[#9D9D94]">
                A caminho do seu endereço
              </p>
            </div>

            <div
              className={`mt-6 h-[2px] flex-1 transition-all duration-300 ${
                etapaAtual() >= 3 ? "bg-[#F2DAAC]" : "bg-[#F2DAAC]/30"
              }`}
            />

            <div className="flex w-24 flex-col items-center text-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  etapaAtual() >= 3
                    ? "bg-[#F2DAAC] text-[#161410]"
                    : "border border-[#F2DAAC]/40 bg-[#1a1713] text-[#F2DAAC]/40"
                }`}
              >
                <Check size={22} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#F2DAAC]">Concluído</p>
              <p className="text-[10px] text-[#9D9D94]">Pedido entregue</p>
            </div>
          </div>
        )}
      </div>

      {/* RESUMO DO PEDIDO */}
      <div className="mt-6 rounded-xl border border-[#F2DAAC]/30 bg-[#161410] p-6 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#F2DAAC] uppercase">
          <ScrollText size={16} />
          <span>Resumo do Pedido</span>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item: any) => {
              const product = item.productid || item.product;
              return (
                <div className="flex flex-col">
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {product?.img && (
                        <img
                          src={product.img}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#F2DAAC] uppercase">
                          {product?.name}
                        </p>
                        <span className="text-xs text-[#9D9D94]">
                          {item.quantity}x
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#F2DAAC]">
                      {formatterPrice((product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-4 rounded-lg border border-[#F2DAAC]/15 bg-[#201D17] p-4">
                    <h3 className="mb-3 text-[11px] font-bold tracking-widest text-[#F2DAAC]/70 uppercase">
                      Informações Gerais
                    </h3>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <CreditCard
                          size={16}
                          className="mt-0.5 text-[#F2DAAC]"
                        />

                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#9D9D94]">
                            Forma de pagamento
                          </span>
                          <span className="text-sm font-medium text-[#F2DAAC]">
                            {order?.formaPagamento}
                          </span>
                        </div>
                      </div>

                      {order?.observacao && (
                        <div className="flex items-start gap-3">
                          <MessageSquare
                            size={16}
                            className="mt-0.5 shrink-0 text-[#F2DAAC]"
                          />

                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-[#9D9D94]">
                              Observações
                            </span>
                            <span className="text-sm leading-relaxed text-[#F2DAAC]">
                              {order.observacao}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-[#9D9D94]">Nenhum item listado.</p>
          )}
        </div>

        <div className="my-4 h-[1px] w-full bg-[#F2DAAC]/20" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Total do pedido</span>
          <span className="text-lg font-extrabold text-[#F2DAAC]">
            {formatterPrice(order?.total || 0)}{" "}
            {order?.tipoEntrega !== "retirar" && "(Com taxa de entrega)"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg bg-[#F2DAAC] px-8 py-3 text-sm font-bold text-[#161410] transition hover:bg-[#e4cb9c]"
        >
          <HomeIcon size={18} />
          <span>Voltar para o cardápio</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSucess;
