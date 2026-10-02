import type { Request, Response } from "express";
import { prisma } from "../db.js";

// Armazena as conexões ativas do Server-Sent Events (SSE)
const clients: Record<string, Response[]> = {};
let adminClients: Response[] = [];

export function subscribeAdminEvents(req: Request, resp: Response) {
  resp.setHeader("Content-Type", "text/event-stream");
  resp.setHeader("Cache-Control", "no-cache");
  resp.setHeader("Connection", "keep-alive");

  adminClients.push(resp);

  // Remove da lista quando o admin fecha a tela ou desloga
  req.on("close", () => {
    adminClients = adminClients.filter((client) => client !== resp);
  });
}

// Helper para notificar todos os Admins conectados
function notifyAdmins(data: any) {
  adminClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Rota onde o frontend abre a conexão em tempo real
export function subscribeOrderEvents(
  req: Request<{ id: string }>,
  resp: Response,
) {
  const { id } = req.params;

  // Configuração dos cabeçalhos HTTP do SSE
  resp.setHeader("Content-Type", "text/event-stream");
  resp.setHeader("Cache-Control", "no-cache");
  resp.setHeader("Connection", "keep-alive");

  if (!clients[id]) {
    clients[id] = [];
  }
  clients[id].push(resp);

  // Quando o usuário fecha a aba ou sai da tela, removemos a conexão
  req.on("close", () => {
    const activeClients = clients[id];

    if (!activeClients) {
      return;
    }

    clients[id] = activeClients.filter((client) => client !== resp);

    if (clients[id].length === 0) {
      delete clients[id];
    }
  });
}

export async function createOrder(req: Request, resp: Response) {
  try {
    const { user } = req;
    const {
      metodoPagamento,
      observacoes,
      tipoEntrega,
      totalFinal,
      opcaoEntrega,
    } = req.body;

    if (!metodoPagamento && !tipoEntrega) {
      return resp.status(400).json({
        message: "Forma de pagamento e tipo de entrega são obrigatórios",
      });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { productid: true },
    });

    if (cartItems.length === 0) {
      return resp.status(400).json({ message: "Carrinho vazio" });
    }

    const total = Math.round(totalFinal);

    const order = await prisma.order.create({
      data: {
        total: total,
        userId: user.id,
        formaPagamento: metodoPagamento || opcaoEntrega,
        observacao: observacoes,
        tipoEntrega: tipoEntrega,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.productid.price,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });
    notifyAdmins({ type: "NEW_ORDER", order });

    resp.status(201).json({ cartItems, order });
  } catch (e) {
    return resp.status(500).json("Erro ao criar pedido");
  }
}

export async function getOrders(req: Request, resp: Response) {
  try {
    const { user } = req;

    const filterUserOrders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (filterUserOrders.length === 0) {
      return resp
        .status(404)
        .json({ message: "Não foram encontrados pedidos" });
    }

    resp.status(200).json(filterUserOrders);
  } catch (e) {
    return resp.status(500).json("Erro ao buscar pedidos");
  }
}

export async function updateStatus(
  req: Request<{ id: string }>,
  resp: Response,
) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { user } = req;

    if (!id) {
      return resp
        .status(400)
        .json({ message: "Bad Request, não foi passado nenhum id de pedido" });
    }

    if (!status) {
      return resp.status(400).json({
        message: "Bad Request, não foi passado nenhum status",
      });
    }

    if (user.admin != true) {
      return resp.status(401).json({ message: "Não autorizado" });
    }

    let deliveredTime;
    if (status !== "Pendente") {
      deliveredTime = new Date();
    } else {
      deliveredTime = null;
    }

    const novoStatusEDelivered = await prisma.order.update({
      where: { id: id },
      data: {
        status: status,
        deliveredTime: deliveredTime,
      },
    });

    if (clients[id]) {
      clients[id].forEach((client) => {
        client.write(`data: ${JSON.stringify(novoStatusEDelivered)}\n\n`);
      });
    }

    notifyAdmins({ type: "UPDATE_STATUS", order: novoStatusEDelivered });

    resp.status(200).json({
      novoStatus: novoStatusEDelivered.status,
      deliveredTime: novoStatusEDelivered.deliveredTime,
      message: "Sucesso",
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getOrderById(
  req: Request<{ id: string }>,
  resp: Response,
) {
  try {
    const { id } = req.params;
    const { user } = req;

    const order = await prisma.order.findFirst({
      where: { id: id, userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return resp.status(404).json({ message: "Pedido não encontrado" });
    }

    resp.status(200).json(order);
  } catch (e) {
    return resp.status(500).json({ message: "Erro ao buscar o pedido" });
  }
}
