import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/inputfild/InputField" 
import { useState, type FormEvent } from "react"
import { FaEye } from "react-icons/fa"

import { auth, db } from "../../services/firebase.connection"
import { signInWithEmailAndPassword } from "firebase/auth"
import { syncUsernameWithName } from "../../utils/createUsernameIfNotExists"
import { doc, getDoc } from "firebase/firestore"
import toast from "react-hot-toast"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (email === '' || password === '') {
        toast.error("Preencha todos os campos!" , {
            position: "top-right"
        })
        return
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await syncUsernameWithName(user)

        const usernameDocRef = doc(db, "users", user.uid)
        const usernameSnap = await getDoc(usernameDocRef)
        const username = usernameSnap.data()?.username

        const nameDocRef = doc(db, "users", user.uid, "profile", "info")
        const nameSnap = await getDoc(nameDocRef)
        const name = nameSnap.data()?.name || "Usuário"

        if (username) {
            navigate(`/user/${username}`, { replace: true })

            toast(`Bem vindo novamente ${name}`, {
                icon: '👏',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                position: "top-center"
            })
        } else {
            navigate("*", { replace: true })
        }

        } catch (error) {
            console.log("Erro ao fazer login:" + error)
            toast.error("Usuário não encontrado ou dados incorretos!", {
                position: "top-right"
            })
        }
    }

    function handleShowEye() {
        setShowPassword(prev => !prev)
    }

    return (
        <div className="flex flex-col w-full h-screen justify-center items-center">
            <h1 className="text-white text-5xl lg:text-6xl font-black mb-14">
                My<span className="bg-linear-to-r bg-purple-500 to-blue-500 bg-clip-text text-transparent">Link</span>
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col px-3">
                <label className="text-white font-medium">E-mail</label>
                <Input
                    placeholder="seuemail@exemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="w-full max-w-xl relative mt-1">
                    <label className="text-white font-medium">Senha</label>
                    <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={handleShowEye} 
                        className="absolute right-2  top-1.5 text-white cursor-pointer hover:text-gray-300"
                        >
                        <FaEye size={18}/>
                    </button>
                </div>

                <button
                    type="submit" 
                    className="h-9 bg-blue-600 rounded-md border-0 text-white font-medium text-lg cursor-pointer mt-3"
                    >
                    Entrar
                </button>
            </form>

            <div className="flex gap-2 mt-3 mb-20">
                <h3 className="text-white/85">
                    Não possui uma conta?
                </h3>

                <Link to={"/signup"} className="text-blue-500/95 hover:text-blue-400 duration-150">
                    Criar
                </Link>
            </div>
        </div>
    )
}