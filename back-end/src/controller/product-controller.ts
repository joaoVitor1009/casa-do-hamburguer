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

export async function createProduct(req: Request, resp: Response) {
  try {
    const { name, description, price, category } = req.body;

    const image = req.file;

    if (!image) {
      resp.status(400).json({
        message: "Imagem do produto é obrigatória",
      });

      return;
    }

    const productExists = await prisma.product.findFirst({
      where: { name: name },
    });

    if (productExists) {
      resp.status(400).json({ message: "Produto já existe" });
      return;
    }

    const imagePath = `/${image.filename}`;
    const priceNumber = Number(price);

    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: priceNumber,
        img: imagePath,
        category: category,
      },
    });

    resp.status(201).json(product);
  } catch (e) {
    console.error("ERRO AO CRIAR PRODUTO:", e);

    resp.status(500).json({
      message: "Server Error",
    });
  }
}
