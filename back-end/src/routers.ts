import { Router } from "express";
import { auth, login, logout, register } from "./controller/user-controller.js";
import { authMiddleware } from "./middlewares/auth.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
} from "./controller/product-controller.js";
import {
  createCartItem,
  deleteCartItem,
  getCartitems,
} from "./controller/cartItem-controller.js";
import {
  createOrder,
  getOrders,
  updateStatus,
} from "./controller/order-controller.js";

import { upload } from "./middlewares/upload.js";

export const router = Router();

//Rotas de Usuário
router.post("/login", login);
router.post("/register", register);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, auth);

//Rotas de produto
router.get("/getProduct", getProduct);
router.delete("/deleteProduct/:id", authMiddleware, deleteProduct);
router.post(
  "/createProduct",
  authMiddleware,
  upload.single("image"),
  createProduct,
);

//Rotas Cart/Carrinho
router.get("/getItems", authMiddleware, getCartitems);
router.post("/createCartitem", authMiddleware, createCartItem);
router.delete("/deleteCartitem/:id", authMiddleware, deleteCartItem);

//Rotas Orders
router.post("/createOrders", authMiddleware, createOrder);
router.get("/getOrders", authMiddleware, getOrders);
router.put("/updateStatus/:id", authMiddleware, updateStatus);
