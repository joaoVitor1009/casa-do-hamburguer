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
