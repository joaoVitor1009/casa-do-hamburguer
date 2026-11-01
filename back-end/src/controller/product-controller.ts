import { type Request, type Response } from "express";
import { prisma } from "../db.js";
import { match } from "node:assert";

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

export const updateProduct = async (
  req: Request<{ id: string }>,
  resp: Response,
) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { name, description, price, category } = req.body;
    const priceArounded = Math.round(price);
    if (!user?.admin) {
      return resp.status(401).json({ message: "Não autorizado" });
    }

    const find = await prisma.product.findFirst({
      where: { id: id },
    });

    if (!find) {
      return resp.status(404).json({ message: "Produto não encontrado" });
    }

    await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: priceArounded,
        category,
      },
    });

    return resp.status(200).json({ message: "Sucesso na operação" });
  } catch (e) {
    console.log("Erro na operação");
    return resp.status(500).json({ message: "Erro no servidor" });
  }
};
