import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function enviar(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(email);
    console.log(senha);
  }

  return (
    <form
      className="flex h-screen items-center justify-center bg-[#161410]"
      onSubmit={enviar}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Link to={"/"}>
          <img src="./public/logo.png" alt="" className="mb-5.75" />
        </Link>

        <Input
          placeholder="E-mail"
          type="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button title="Login" />
        <Link to={"/register"} className="w-full">
          <Button title="Não tenho uma conta" variant="second" />
        </Link>
      </div>
    </form>
  );
};

export default Login;
