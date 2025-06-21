import { useEffect, useState, type FormEvent } from "react";
import { Header } from "../../components/header";
import { Input } from "../../components/input";
import { FaEdit } from "react-icons/fa";

import { auth, db } from "../../services/firebase.connection";
import { addDoc, updateDoc, query, orderBy, collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { FiTrash } from "react-icons/fi";
import toast from "react-hot-toast";

interface LinkProps {
    id: string,
    name: string,
    url: string,
    bg: string
}

export function Networks() {
    const [nameRedeSocial, setNameRedeSocial] = useState("")
    const [urlRedeSocial, setUrlRedeSocial] = useState("")
    const [lista, setLista] = useState<LinkProps[]>([])
    const [editId, setEditId] = useState<string | null>(null)

    

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const linksRef = collection(db, "users", user.uid, "social");
        const queryRef = query(linksRef, orderBy("created", "asc"));
        
       const unsub = onSnapshot(queryRef, (snapshot) => {
                   let lista = [] as LinkProps[]
       
                   snapshot.forEach((doc) => {
                       lista.push({
                            id: doc.id,
                            name: doc.data().name,
                            url: doc.data().url,
                            bg: getRandomBgColor()
                       })
                   })
       
                   setLista(lista)
               })
       
               return () => {
                   unsub()
               }
       
    }, [])

    const redesPermitidas = ["facebook", "instagram", "youtube", "linkedin"]

    async function handleRegister(e: FormEvent) {
        e.preventDefault()
        const nome = nameRedeSocial.toLowerCase()
                
        const user = auth.currentUser;
        if (!user) return;

        if (!redesPermitidas.includes(nome)) {
            alert("Rede social inválida. Escolha entre Facebook, Instagram, YouTube ou LinkedIn.")
            return
        }

        if (editId) {
            const docRef = doc(db, "users", user.uid, "social", editId)
            await updateDoc(docRef, {
            name: nameRedeSocial,
            url: urlRedeSocial
            })
            toast.success('Atualizado com sucesso!', {
                position: "top-right"
            })
        } else {
            await addDoc(collection(db, "users", user.uid, "social"), {
            name: nameRedeSocial,
            url: urlRedeSocial,
            created: new Date()
            })
            toast.success('Cadastrado com sucesso!', {
                position: "top-right"
            })
        }

        setNameRedeSocial("")
        setUrlRedeSocial("")
        setEditId(null)
    }

    async function handleDeleteLink(id: string) {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid, "social", id)
        await deleteDoc(docRef)
        toast.success('Deletado com sucesso!', {
            position: "top-right"
        })
    }

    function handleEditLink(link: LinkProps) {
        setNameRedeSocial(link.name)
        setUrlRedeSocial(link.url)
        setEditId(link.id)
    }
    
    const colors = [
        "bg-[#9B5DE5]",
        "bg-[#7A4DE8]",
        "bg-[#4D59E8]",
        "bg-[#3A86FF]",
    ];

    function getRandomBgColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    return (
        <div className="flex flex-col min-h-screen items-center pb-7 px-2">
            <Header/>

            <h1 className="text-white text-2xl font-bold mt-8 mb-4">
                Redes Sociais
            </h1>

            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <Input
                    list="social-options"
                    type="text"
                    placeholder="Rede Social"
                    value={nameRedeSocial}
                    onChange={(e) => setNameRedeSocial(e.target.value)}
                />

                <Input
                    type="url"
                    placeholder="Digite a url do facebook..."
                    value={urlRedeSocial}
                    onChange={(e) => setUrlRedeSocial(e.target.value)}
                />

                <datalist id="social-options">
                    <option value="Facebook" />
                    <option value="Instagram" />
                    <option value="Youtube" />
                    <option value="Linkedin" />
                </datalist>

                <button type="submit" className="mb-7 bg-linear-to-r bg-purple-500 to-blue-500 h-9 rounded-md text-white font-medium flex justify-center items-center gap-4 cursor-pointer">
                    Salvar rede social
                </button>
            </form>

            <h1 className="text-white text-2xl font-bold mt-5 mb-7">
                Minhas Redes sociais
            </h1>

            {lista.map((lista) => {
                return (
                <article key={lista.id} className="flex w-full max-w-xl mt-2 px-1">
                    <div className={`flex items-center justify-between w-full rounded py-3 px-3 select-none ${lista.bg} text-white`}>
                        <p className="font-medium">{lista.name}</p>
                        <div className="flex items-center">
                            <button onClick={() => handleEditLink(lista)} className="p-1 rounded-lg cursor-pointer hover:scale-110 duration-150">
                                <FaEdit size={22} color="#FFF"/>
                            </button>

                            <button onClick={() => handleDeleteLink(lista.id)} className="p-1 rounded-lg cursor-pointer hover:scale-110 duration-150">
                                <FiTrash size={22} color="#FFF"/>
                            </button>
                        </div>
                    </div>
                </article>
                )
            })}
        </div>
    )
}