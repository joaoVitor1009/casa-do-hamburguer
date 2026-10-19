import {
  ArrowLeft,
  ChevronRight,
  UserRound,
  X,
  CalendarDays,
  MapPin,
  Package,
  Car,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { formatterPrice } from "../utils/FormatterPrice";
import CartMyOrders from "../components/CartMyOrders";
import type { ProductInterface } from "../types/Product";
import Button from "../components/Button";

type ItemPedido = {
  id: string;
  name: string;
  description: string;
  img: string;
  price: number;
  quantity: number;
  product: ProductInterface;
};

type Pedido = {
  id: string;
  createdAt: Date;
  status: string;
  total: number;
  tipoEntrega: string;
  formaPagamento: string;
  observacao: string;
  cep: string;
  items: ItemPedido[];
};

const statusStyle: Record<string, string> = {
  Preparando: "bg-yellow-500/20 text-yellow-400",
  Retirado: "bg-orange-500/20 text-orange-400",
  Concluido: "bg-green-600/20 text-green-400",
  Cancelado: "bg-red-600/20 text-red-400",
};

const MyOrders = () => {
  const { user } = useContext(UserContext);
  const [showCart, setShowCart] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState<Pedido | null>(null);
  const [filterStatus, setFilterStatus] = useState("Pendente");
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Pedido[]>([]);

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/getOrdersById", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      console.log("Pedidos recebidos:", data);
      setOrders(data);
      return;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const getfilterStatus = (categoryName: string) => {
    const elementoSelecionado = "forty";

    const elementoNãoSelecionado = "thirty";

    if (filterStatus === categoryName) {
      return elementoSelecionado;
    } else {
      return elementoNãoSelecionado;
    }
  };

  const handleChangefilterStatus = (newCategory: string) => {
    setFilterStatus(newCategory);
  };

  const filteredOrder = orders.filter((order) => {
    return order.status === filterStatus;
  });

  useEffect(() => {
    getOrders();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const eventSource = new EventSource(
      `http://localhost:3000/order-events/${user.id}`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      try {
        const updatedOrder: Pedido = JSON.parse(event.data);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id
              ? { ...order, ...updatedOrder }
              : order,
          ),
        );
      } catch (err) {
        console.error("Erro ao processar mensagem SSE:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão em tempo real:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id]);
  return (
    <div className="min-h-screen bg-[#161410] px-4 py-6 text-white sm:px-8">
      <main className="mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-center gap-4 border-b border-[#F2DAAC]/30 pb-5">
          <button
            onClick={() => navigate("/")}
            className="text-[#F2DAAC] transition hover:text-white"
            aria-label="Voltar"
          >
            <ArrowLeft size={25} />
          </button>

          <h1 className="text-2xl font-bold text-[#F2DAAC]">Meus Pedidos</h1>
        </header>

        {/* Informações do usuário */}
        <section className="mb-6 flex items-center gap-4 border-b border-[#F2DAAC]/30 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#F2DAAC] text-[#F2DAAC]">
            <UserRound size={34} />
          </div>

          <div>
            <h2 className="font-semibold text-[#F2DAAC]">
              {user?.name || "Usuário"}
            </h2>
            <p className="mt-1 text-sm text-[#9D9D94]">
              CEP: {user?.cep || "Não informado"}
            </p>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 py-2 md:py-3">
          <Button
            title="Pendente"
            variant={getfilterStatus("Pendente")}
            onClick={() => handleChangefilterStatus("Pendente")}
          />
          <Button
            title="Preparando"
            variant={getfilterStatus("Preparando")}
            onClick={() => handleChangefilterStatus("Preparando")}
          />

          <Button
            title="Retirado/Retirar"
            variant={getfilterStatus("Retirado")}
            onClick={() => handleChangefilterStatus("Retirado")}
          />

          <Button
            title="Concluido"
            variant={getfilterStatus("Concluido")}
            onClick={() => handleChangefilterStatus("Concluido")}
          />

          <Button
            title="Cancelado"
            variant={getfilterStatus("Cancelado")}
            onClick={() => handleChangefilterStatus("Cancelado")}
          />
        </div>

        {/* Lista de pedidos */}
        <section className="mt-5 space-y-4">
          {filteredOrder.map((pedido) => (
            <div
              key={pedido.id}
              onClick={() => {
                if (
                  pedido.status === "Concluido" ||
                  pedido.status === "Cancelado"
                ) {
                  setShowOrderDetails(pedido);
                  setShowCart(true);
                  return;
                }

                navigate(`/OrderSucess/${pedido.id}`);
                setShowCart(false);
                setShowOrderDetails(null);
                return;
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#F2DAAC]/20 bg-[#1B1915] p-4 text-left transition hover:border-[#F2DAAC]/60 hover:bg-[#211E18]"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[#F2DAAC]">
                  #{pedido.id.slice(0, 5)}
                </h3>
                <p className="mt-1 text-sm text-[#9D9D94]">
                  {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 ${
                  statusStyle[pedido.status] || "bg-gray-500/20 text-gray-300"
                }`}
              >
                {pedido.tipoEntrega === "retirar" &&
                pedido.status === "Retirado"
                  ? "Retirar na loja"
                  : pedido.status}
              </span>

              <p className="shrink-0 text-sm font-bold text-[#F2DAAC] sm:text-base">
                {formatterPrice(pedido.total)}
              </p>

              <ChevronRight size={20} className="shrink-0 text-[#F2DAAC]" />
            </div>
          ))}
        </section>

        {showCart && (
          <CartMyOrders
            id={showOrderDetails?.id}
            createdAt={showOrderDetails?.createdAt}
            formaPagamento={showOrderDetails?.formaPagamento}
            observacao={showOrderDetails?.observacao}
            status={showOrderDetails?.status}
            tipoEntrega={showOrderDetails?.tipoEntrega}
            total={showOrderDetails?.total}
            user={user}
            setShowCart={setShowCart}
            item={
              showOrderDetails?.items?.map((item) => ({
                id: item.id,
                price: item.price,
                product: item.product,
                quantity: item.quantity,
              })) ?? []
            }
          />
        )}

        {orders.length === 0 && (
          <div className="py-16 text-center">
            <Package size={42} className="mx-auto mb-3 text-[#9D9D94]" />
            <p className="text-[#9D9D94]">Você ainda não possui pedidos.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
