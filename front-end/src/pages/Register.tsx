import { useContext, useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import { UserContext } from "../contexts/UserContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setSenha] = useState("");
  const [checksenha, setCheckSenha] = useState("");
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  async function enviar(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!name || !email || !password || !cep) {
        alert("Todas as informações são obrigatórias");
        setError("Todas as informações são obrigatórias");
        return;
      }

      if (password !== checksenha) {
        setError("Senhas não conferem");
        return;
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password, cep }),
        credentials: "include",
      });

      switch (response.status) {
        case 409:
          setError("Email já cadastrado");
          break;
        case 400:
          setError("Todas as informações são obrigatórias");
          console.log(response);
          break;
        case 201:
          setName("");
          setEmail("");
          setSenha("");
          setCheckSenha("");
          setCep("");
          setError("");
          const data = await response.json();
          navigate("/");
          setUser(data);
          break;
        case 500:
          setError("Tente novamente mais tarde");
          break;
        default:
          setError("");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      return;
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
        <div className="mb-2 flex flex-col justify-center gap-2.5">
          <Input
            placeholder="Nome completo"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Input
            placeholder="E-mail"
            type="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <Input
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
            value={password}
          />
          <Input
            placeholder="Confirme sua senha"
            type="password"
            onChange={(e) => setCheckSenha(e.target.value)}
            value={checksenha}
          />
          <Input
            placeholder="C.E.P"
            onChange={(e) => setCep(e.target.value)}
            value={cep}
          />
          <p className="text-left font-bold text-red-500">{error}</p>
        </div>

        <Button title="Criar" type="submit" />
        <Link to={"/login"} className="w-full">
          <Button title="Ja tenho uma conta" variant="second" />
        </Link>
      </div>
    </form>
  );
};

export default Register;
