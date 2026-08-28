import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <Input
            placeholder="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

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
