import { Link, useLocation } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState, useRef } from "react";
import {
  LogOut,
  ShoppingCart,
  SquareMenu,
  ScrollText,
  Plus,
} from "lucide-react";
import Cart from "./Cart";
import { CartItemContext } from "../contexts/CartItemContext";
import CardProduct from "./CardProduct";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showCartProduct, setShowCartProduct] = useState<boolean>(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { cartItems, getCartItems } = useContext(CartItemContext);

  const handleAuthUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });

      if (response.status !== 200) {
        console.log("Error");
        return;
      }
      const data = await response.json();
      if (!data) {
        return;
      }
      setUser(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.status !== 200) {
        return;
      }
      setUser(null);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  useEffect(() => {
    handleAuthUser();
    getCartItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    };

    if (showCart) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCart]);

  const getNavItemClass = (path: string) => {
    const baseClass =
      "flex h-8.75 w-8.75 cursor-pointer items-center justify-center rounded-md border";
    if (location.pathname === path) {
      return baseClass + " bg-[#F2DAAC] text-[#161410]";
    } else {
      return baseClass;
    }
  };

  let cartQuantity = 0;

  for (let i = 0; i < cartItems.length; i++) {
    cartQuantity += cartItems[i].quantity;
  }

  return (
    <div className="bg-[#161410]">
      {showCart && (
        <div ref={cartRef}>
          <Cart setShowCart={setShowCart} showCart={showCart} />
        </div>
      )}
      {showCartProduct && (
        <div>
          <CardProduct
            setShowCartProduct={setShowCartProduct}
            showCartProduct={showCartProduct}
          />
        </div>
      )}

      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-184.25 md:p-0">
        <Link to={"/"}>
          <img
            src="/logo.png"
            alt=""
            className="h-auto w-24"
            onClick={() => setShowCartProduct(false)}
          />
        </Link>

        {user ? (
          <div className="flex items-center gap-8 text-white">
            {user.admin && (
              <div className="hidden items-center gap-2 text-[#F2DAAC] md:flex">
                <Link to={"/"}>
                  <div
                    className={getNavItemClass("/")}
                    onClick={() => setShowCartProduct(false)}
                  >
                    <SquareMenu size={20} />
                  </div>
                </Link>
                <Link to={"/orders"}>
                  <div
                    className={getNavItemClass("/orders")}
                    onClick={() => setShowCartProduct(false)}
                  >
                    <ScrollText size={20} />
                  </div>
                </Link>
                <Link to={"/orders/new"}>
                  <div
                    className={getNavItemClass("/orders/new")}
                    onClick={() => setShowCartProduct(!showCartProduct)}
                  >
                    <Plus size={20} />
                  </div>
                </Link>
              </div>
            )}

            <div className="relative cursor-pointer">
              <ShoppingCart size={24} onClick={() => setShowCart(!showCart)} />
              <p className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2DAAC] text-[#161410]">
                {cartQuantity}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p>Olá, {user?.name} </p>
              <LogOut
                className="cursor-pointer"
                size={24}
                onClick={handleLogout}
              />
            </div>
          </div>
        ) : (
          <Link to={"/login"}>
            <div className="flex h-7.75 w-26.25 cursor-pointer items-center justify-center rounded-sm bg-[#F2DAAC] md:h-9.5 md:w-35">
              Entrar
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
