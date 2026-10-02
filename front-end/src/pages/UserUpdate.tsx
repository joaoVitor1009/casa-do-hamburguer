import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  MapPin,
  Save,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";

const UserUpdate = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [password, setSenha] = useState("");
  const [checkPassword, checkSetSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleUpdateDataUser = async () => {
    try {
      if (password !== checkPassword) {
        setError("Senhas não conferem");
        return;
      }
      if (!email && !name && !cep) {
        alert("Algum campo deve ser preenchido para atualizar os dados!");
        return;
      }
      const emailLower = email.toLowerCase();
      const response = await fetch(
        `http://localhost:3000/updateDataUser/${user?.id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: emailLower,
            cep: cep,
            password: password,
          }),
          credentials: "include",
        },
      );

      if (response.status === 401) {
        setError("Email ja cadastrado");
        return;
      }

      if (response.status === 200) {
        setError("");
        setUser(null);
        alert("Alterções salvas com Sucesso!");
        navigate("/login");
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-[#161410] text-white">
      <main className="mx-auto max-w-3xl px-5 py-6">
        {/* VOLTAR */}
        <Link
          to="/"
          className="mb-4 flex w-fit items-center gap-2 text-xs text-[#F2DAAC] transition hover:opacity-80"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        {/* CARD */}
        <div className="rounded-xl border border-[#F2DAAC]/25 bg-[#161410] p-6 shadow-md">
          {/* TÍTULO */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F2DAAC]/70">
              <User size={23} strokeWidth={1.7} className="text-[#F2DAAC]" />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-wide text-[#F2DAAC]">
                ATUALIZAR CADASTRO
              </h1>

              <p className="text-xs text-[#9D9D94]">
                Atualize seus dados pessoais.
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-4">
            {/* NOME */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#F2DAAC]">
                NOME
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#1B1915] px-3">
                <User size={17} className="shrink-0 text-[#F2DAAC]" />

                <input
                  type="text"
                  placeholder="Digite seu nome (opcional)"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#F2DAAC]">
                E-MAIL
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#1B1915] px-3">
                <Mail size={17} className="shrink-0 text-[#F2DAAC]" />

                <input
                  type="email"
                  placeholder="Digite seu e-mail (opcional)"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
                />
              </div>

              {error === "Email ja cadastrado" && (
                <p className="mt-1 text-right text-xs text-red-500">{error}</p>
              )}
            </div>

            {/* CEP */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#F2DAAC]">
                CEP
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#1B1915] px-3">
                <MapPin size={17} className="shrink-0 text-[#F2DAAC]" />

                <input
                  type="text"
                  placeholder="00000-000 (opcional)"
                  maxLength={9}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
                />
              </div>
            </div>

            {/* ALTERAR SENHA */}
            <div className="mt-1 rounded-lg border border-[#F2DAAC]/15 bg-[#1B1915]">
              <button
                type="button"
                onClick={() => setChangePassword(!changePassword)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <LockKeyhole size={17} className="text-[#F2DAAC]" />

                  <span className="text-xs font-bold text-[#F2DAAC]">
                    Deseja alterar a senha?
                  </span>
                </div>

                <span className="text-lg text-[#F2DAAC]">
                  {changePassword ? "−" : "+"}
                </span>
              </button>

              {/* CAMPOS DA SENHA */}
              {changePassword && (
                <div className="border-t border-[#F2DAAC]/10 px-4 pt-4 pb-4">
                  <div className="flex flex-col gap-4">
                    {/* NOVA SENHA */}
                    <div>
                      <label className="mb-1.5 block text-xs text-[#9D9D94]">
                        Nova senha
                      </label>

                      <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#161410] px-3">
                        <LockKeyhole
                          size={16}
                          className="shrink-0 text-[#F2DAAC]"
                        />

                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite uma nova senha"
                          onChange={(e) => setSenha(e.target.value)}
                          className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#9D9D94] hover:text-[#F2DAAC]"
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* CONFIRMAR SENHA */}
                    <div>
                      <label className="mb-1.5 block text-xs text-[#9D9D94]">
                        Confirmar nova senha
                      </label>

                      <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#161410] px-3">
                        <LockKeyhole
                          size={16}
                          className="shrink-0 text-[#F2DAAC]"
                        />

                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua nova senha"
                          onChange={(e) => checkSetSenha(e.target.value)}
                          className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#77776F]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-[#9D9D94] hover:text-[#F2DAAC]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>

                      {error === "Senhas não conferem" && (
                        <p className="mt-1 text-right text-xs text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES */}
            <div className="mt-3 flex gap-3">
              <Link
                to="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#F2DAAC]/70 px-4 py-2.5 text-xs font-bold text-[#F2DAAC] transition hover:bg-[#F2DAAC]/10"
              >
                <ArrowLeft size={16} />
                RETORNAR
              </Link>

              <button
                type="button"
                onClick={handleUpdateDataUser}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F2DAAC] px-4 py-2.5 text-xs font-bold text-[#161410] transition hover:bg-[#e4cb9c]"
              >
                <Save size={16} />
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserUpdate;
