import { Link, useLocation } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect } from "react";
import {
  LogOut,
  ShoppingCart,
  SquareMenu,
  ScrollText,
  Plus,
} from "lucide-react";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

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
  }, []);

  const getNavItemClass = (path: string) => {
    const baseClass =
      "flex h-8.75 w-8.75 cursor-pointer items-center justify-center rounded-md border";
    if (location.pathname === path) {
      return baseClass + " bg-[#F2DAAC] text-[#161410]";
    } else {
      return baseClass;
    }
  };

  return (
    <div className="items-center bg-[#161410]">
      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-184.25 md:p-0">
        <Link to={"/"}>
          <img src="./public/logo.png" alt="" />
        </Link>

        {user ? (
          <div className="flex items-center gap-8 text-white">
            {user.admin && (
              <div className="hidden items-center gap-2 text-[#F2DAAC] md:flex">
                <Link to={"/"}>
                  <div className={getNavItemClass("/")}>
                    <SquareMenu size={20} />
                  </div>
                </Link>
                <Link to={"/orders"}>
                  <div className={getNavItemClass("/orders")}>
                    <ScrollText size={20} />
                  </div>
                </Link>
                <Link to={""}>
                  <div className="flex h-8.75 w-8.75 cursor-pointer items-center justify-center rounded-md border">
                    <Plus size={20} />
                  </div>
                </Link>
              </div>
            )}
            <div className="relative cursor-pointer">
              <ShoppingCart size={24} />
              <p className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2DAAC] text-[#161410]">
                1
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
