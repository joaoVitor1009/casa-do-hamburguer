import { Router } from "express";
import { auth, login, logout, register } from "./controller/user-controller.js";
import { authMiddleware } from "./middlewares/auth.js";
import { getProduct } from "./controller/product-controller.js";

export const router = Router();

//Rotas de Usuário
router.post("/login", login);
router.post("/register", register);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, auth);

//Rotas de produto
router.get("/getProduct", getProduct);
