import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router";
import Button from "../components/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [checksenha, setCheckSenha] = useState("");
  const [cep, setCep] = useState("");

  function enviar(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(name, email, senha, checksenha, cep);
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
          placeholder="Nome completo"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="E-mail"
          type="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
        <Input
          placeholder="Confirme sua senha"
          type="password"
          onChange={(e) => setCheckSenha(e.target.value)}
        />
        <Input placeholder="C.E.P" onChange={(e) => setCep(e.target.value)} />
        <Button title="Criar" />
        <Link to={"/login"} className="w-full">
          <Button title="Ja tenho uma conta" variant="second" />
        </Link>
      </div>
    </form>
  );
};

export default Register;
