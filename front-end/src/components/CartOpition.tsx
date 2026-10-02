import { X, User, ClipboardList, LogOut, ChevronRight } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";

type cartTypes = {
  setShowCartOption: React.Dispatch<React.SetStateAction<boolean>>;
  showCartOption: boolean;
};

const CartOptional = ({ setShowCartOption, showCartOption }: cartTypes) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

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
      navigate("/");
    } catch (e) {
      console.log(e);
      return;
    }
  };

  return (
    <div className="absolute right-0 z-10 flex h-screen w-87.5 flex-col bg-[#F2DAAC] px-5 py-5 md:w-141.25">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <X
          size={21}
          className="cursor-pointer"
          onClick={() => setShowCartOption(false)}
        />
      </div>

      {/* Usuário */}
      <div className="mt-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black">
          <User size={24} />
        </div>

        <div>
          <p className="text-sm font-bold">{user?.name}</p>

          <p className="text-xs opacity-60">CEP: {user?.cep}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-7">
        {/* Atualizar cadastro */}
        <button
          type="button"
          onClick={() => {
            navigate("/UserUpdate");
            setShowCartOption(false);
          }}
          className="flex w-full cursor-pointer items-center justify-between border-t border-black/25 py-3.5"
        >
          <div className="flex items-center gap-3">
            <User size={18} />
            <span className="text-sm">Atualizar cadastro</span>
          </div>

          <ChevronRight size={18} />
        </button>

        {/* Meus pedidos */}
        <button
          type="button"
          onClick={() => {
            navigate("/");
            setShowCartOption(false);
          }}
          className="flex w-full items-center justify-between border-t border-black/25 py-3.5"
        >
          <div className="flex items-center gap-3">
            <ClipboardList size={18} />
            <span className="text-sm">Meus pedidos</span>
          </div>

          <ChevronRight size={18} />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            handleLogout();
            setShowCartOption(false);
          }}
          className="flex w-full cursor-pointer items-center gap-3 border-t border-black/25 py-3.5"
        >
          <LogOut size={18} />

          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CartOptional;
