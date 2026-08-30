import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

export const login = async (req: Request, resp: Response) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    if (!email || !password) {
      resp.status(400).json({
        message: "Bad request, Entering email and password is required.",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email: emailLower },
    });

    if (!user) {
      resp.status(404).json({ message: "User not found" });
      return;
    }

    const match = await bcrypt.compare(password, user?.password);

    if (!match) {
      resp.status(401).json({ message: "Email ou senha incorretos" });
      return;
    }

    const userInfos = {
      id: user.id,
      name: user.name,
      email: user.email,
      cep: user.cep,
      admin: user.admin,
    };

    if (!process.env.JWT_SECRET) {
      return;
    }

    const token = jwt.sign(userInfos, process.env.JWT_SECRET);

    resp.cookie("user", token, { maxAge: 1800000 });

    resp.status(200).json(userInfos);
  } catch (error) {
    resp.status(500).json({ message: "Server error" });
    return;
  }
};

export const register = async (req: Request, resp: Response) => {
  try {
    const { name, email, password, cep } = req.body;

    const emailLower = email.toLowerCase();

    if (!name || !email || !password || !cep) {
      resp
        .status(400)
        .json({ message: "Name, email, password, and CEP are required." });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findFirst({
      where: { email: emailLower },
    });

    if (userExists?.email) {
      resp.status(409).json({ message: "email já cadastrado" });
      return;
    }

    const newUser = await prisma.user.create({
      data: { name: name, email: emailLower, password: hash, cep: cep },
    });

    console.log(newUser);
    if (!process.env.JWT_SECRET) {
      return;
    }

    const userInfos = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      cep: newUser.cep,
      admin: newUser.admin,
    };
    console.log(userInfos);

    const token = jwt.sign(userInfos, process.env.JWT_SECRET);

    resp.cookie("user", token, { maxAge: 1800000 });
    resp.status(201).json(userInfos);
  } catch (e) {
    resp.status(500).json({ message: "Server error" });
    console.log(e);
  }
};

export const auth = async (req: Request, resp: Response) => {
  try {
    const { user } = req;
    resp.status(200).json(user);
  } catch (e) {
    resp.status(500).json(e);
    return;
  }
};

export const logout = async (req: Request, resp: Response) => {
  resp.clearCookie("user");
  resp.status(200).json("usuario deslogado");
};
