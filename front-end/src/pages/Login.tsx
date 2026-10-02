import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  async function enviar(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Email e senha são obrigatórios");
        return;
      }

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.status === 400) {
        setError("Email e senha são obrigatórios");
        return;
      }

      if (response.status === 404) {
        setError("Usuário não encontrado");
        return;
      }

      if (response.status === 401) {
        setError("Email ou senha invalidos");
        return;
      }

      if (response.status === 500) {
        setError("Erro de servidor");
        return;
      }

      if (response.status === 200) {
        setError("");
        const data = await response.json();
        navigate("/");
        console.log(data);
        setUser(data);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <form
      className="flex h-screen items-center justify-center bg-[#161410]"
      onSubmit={enviar}
    >
      <div className="flex flex-col justify-center gap-3">
        <Link to={"/"}>
          <img src="./public/logo.png" alt="" className="mx-auto mb-5.75" />
        </Link>
        <div className="mb-3 flex flex-col gap-2.5">
          <Input
            placeholder="E-mail"
            type="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full">
            <Input
              placeholder="Senha"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-[#9D9D94]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <p className="text-left text-red-500">{error}</p>
        </div>

        <Button title="Login" type="submit" />
        <Link to={"/register"} className="w-full">
          <Button title="Não tenho uma conta" variant="second" />
        </Link>
      </div>
    </form>
  );
};

export default Login;
