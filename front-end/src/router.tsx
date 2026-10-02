import { createBrowserRouter, Outlet } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Header from "./components/Header";
import Orders from "./pages/Orders";
import OrderReview from "./pages/OrderReview";
import PublicRoute from "./components/PublicRoute";
import Payment from "./pages/Payment";
import OrderSucess from "./pages/OrderSucess";
import UserUpdate from "./pages/UserUpdate";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#161410]">
      <Header />
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/new",
        element: <Orders />,
      },
      {
        path: "/OrderReview",
        element: <OrderReview />,
      },
      {
        path: "/Payment",
        element: <Payment />,
      },
      {
        path: "/OrderSucess/:id",
        element: <OrderSucess />,
      },
      {
        path: "/UserUpdate",
        element: <UserUpdate />,
      },
    ],
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
]);
