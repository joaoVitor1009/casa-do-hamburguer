import { type Request, type Response } from "express";
import { prisma } from "../db.js";

export async function getCartitems(req: Request, resp: Response) {
  try {
    const { user } = req;

    const cartitems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { productid: true },
    });

    resp.json(cartitems);
  } catch (e) {
    resp.status(500).json({ message: " Server Error" });
  }
}

export async function createCartItem(req: Request, resp: Response) {
  try {
    const { user } = req;
    const { productId } = req.body;

    if (!productId) {
      resp.status(400).json({ message: "Id de produto não adicionado" });
      return;
    }

    const ExistsInCart = await prisma.cartItem.findFirst({
      where: { productId: productId, userId: user.id },
    });

    let cartItem;

    if (ExistsInCart) {
      cartItem = await prisma.cartItem.update({
        where: { id: ExistsInCart.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId: productId,
          userId: user.id,
        },
      });
    }

    const statuscode = cartItem.quantity === 1 ? 201 : 200;

    resp.status(statuscode).json(cartItem);
  } catch (error) {
    console.error(error);
    resp.status(500).json({
      message: "Erro ao criar item no carrinho",
    });
  }
}
