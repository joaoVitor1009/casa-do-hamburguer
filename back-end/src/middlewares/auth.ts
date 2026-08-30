import type { Request, NextFunction, Response } from "express";
import Jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  resp: Response,
  next: NextFunction,
) => {
  const { user } = req.cookies;

  if (!user) {
    resp.json("Sem usuario detectado");
    return;
  }

  if (!process.env.JWT_SECRET) {
    resp.status(500).json({ message: "Server error" });
    return;
  }

  try {
    const decoded = Jwt.verify(user, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    resp.json({ message: "Usuário não autenticado" });
    return;
  }
};
