import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/inputfild/InputField";
import { PasswordField } from "../../components/PasswordField/PasswordField"; 
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase.connection";
import { createInitialUsername } from "../../utils/createUsernameInital";
import toast from "react-hot-toast";

export function Signup() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { password, setPassword, errors, isValid } = usePasswordValidation();

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email && !password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Digite um email válido!");
      return;
    }

    if (!email) {
      toast.error("Preencha o email!");
      return;
    }

    if (!isValid) {
      toast.error("A senha não atende os critérios.");
      return;
    }

   if(isValid) {
     try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createInitialUsername(userCredential.user);
      toast.success("Conta criada com sucesso!");
      navigate("/admin");
    } catch (error) {
      toast.error("Erro ao criar conta. E-mail já em uso.");
    }
   }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-5xl font-black mb-10 lg:text-6xl">
            My<span className="bg-linear-to-r bg-purple-500 to-blue-500 bg-clip-text text-transparent">Link</span>
        </h1>

      <form onSubmit={handleSignup} className="w-full max-w-xl p-3 space-y-3">
        <Input
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="text-sm opacity-80">
          <p>• Pelo menos 8 caracteres {errors.length && "❌"}</p>
          <p>• Pelo menos 1 maiúscula {errors.uppercase && "❌"}</p>
          <p>• Pelo menos 1 número {errors.number && "❌"}</p>
          <p>• Pelo menos 1 caractere especial {errors.special && "❌"}</p>
        </div>

        <button
          type="submit"
          className="bg-purple-700 rounded-md h-9 w-full text-lg font-medium hover:bg-purple-600 duration-300 cursor-pointer"
        >
          Criar conta
        </button>
      </form>

      <div className="flex gap-2 mt-1">
            <h3 className="text-white/85">
                Possui uma conta?
            </h3>

            <Link to={"/login"} className="text-purple-500/80 hover:text-purple-500 duration-150">
              Entrar
            </Link>
        </div>
    </div>
  );
}