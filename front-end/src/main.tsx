import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router.tsx";
import { RouterProvider } from "react-router";
import { UserProvider } from "./contexts/UserContext.tsx";
import { CartItemProvider } from "./contexts/CartItemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <CartItemProvider>
        <RouterProvider router={router} />
      </CartItemProvider>
    </UserProvider>
  </StrictMode>,
);
