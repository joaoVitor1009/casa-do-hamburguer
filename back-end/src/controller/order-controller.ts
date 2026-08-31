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
