import { type Request, type Response } from "express";
import { prisma } from "../db.js";

export const getProduct = async (req: Request, resp: Response) => {
  try {
    const products = await prisma.product.findMany();

    if (products.length === 0) {
      resp.status(404).json({ message: "Não foram encontrados produtos" });
      return;
    }
    resp.status(200).json(products);
  } catch (e) {
    resp.status(500).json("Server error");
  }
};
