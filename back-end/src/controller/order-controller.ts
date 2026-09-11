import type { Request, Response } from "express";
import { prisma } from "../db.js";

export async function createOrder(req: Request, resp: Response) {
  try {
    const { user } = req;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { productid: true },
    });

    if (cartItems.length === 0) {
      return resp.status(400).json({ message: "Carrinho vazio" });
    }

    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (!item) continue;
      total += item.productid.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        total: total,
        userId: user.id,
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

    resp.status(201).json({ cartItems, order });
  } catch (e) {
    return resp.status(500).json("Erro ao criar pedido");
  }
}

export async function getOrders(req: Request, resp: Response) {
  try {
    const { user } = req;
    console.log(user);

    const filterUserOrders = await prisma.order.findMany({
      include: { user: true },
    });
    console.log(filterUserOrders);
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
    if (status === "Retirado" || status === "Cancelado") {
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

    resp.status(200).json({
      novoStatus: novoStatusEDelivered.status,
      deliveredTime: novoStatusEDelivered.deliveredTime,
      message: "Sucesso",
    });
  } catch (e) {
    console.log(e);
  }
}
