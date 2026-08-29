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

export const deleteProduct = async (
  req: Request<{ id: string }>,
  resp: Response,
) => {
  try {
    const { user } = req;

    if (!user?.admin) {
      resp.status(400).json({ message: "Usario não autenticado  " });
      return;
    }

    const { id } = req.params;

    if (!id) {
      return resp.status(400).json({ message: "Bad request" });
    }

    const del = await prisma.product.delete({
      where: { id: id },
    });

    if (!del) {
      resp
        .status(404)
        .json({ message: "Erro ao deletar o produto - not found" });
      return;
    }

    console.log(del);

    resp.json(id);
  } catch (e: any) {
    if (e.code === "P2025") {
      resp.json({ message: "Produto não encontrado" });
      return;
    }
    resp.status(500).json({ message: "Server Error" });
  }
};
