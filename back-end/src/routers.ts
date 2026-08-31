import { Router } from "express";
import { auth, login, logout, register } from "./controller/user-controller.js";
import { authMiddleware } from "./middlewares/auth.js";
import { deleteProduct, getProduct } from "./controller/product-controller.js";
import {
  createCartItem,
  getCartitems,
} from "./controller/cartItem-controller.js";
import { createOrder } from "./controller/order-controller.js";

export const router = Router();

//Rotas de Usuário
router.post("/login", login);
router.post("/register", register);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, auth);

//Rotas de produto
router.get("/getProduct", getProduct);
router.delete("/deleteProduct/:id", authMiddleware, deleteProduct);

//Rotas Cart/Carrinho
router.get("/getItems", authMiddleware, getCartitems);
router.post("/createCartitem", authMiddleware, createCartItem);

//Rotas Orders
router.post("/createOrders", authMiddleware, createOrder);
