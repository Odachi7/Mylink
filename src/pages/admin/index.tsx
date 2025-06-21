import { Header } from "../../components/header"
import { Input } from "../../components/input"
import { useState, useEffect, type FormEvent } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { FiTrash } from "react-icons/fi"
import { auth, db } from "../../services/firebase.connection";
import { 
    addDoc,
    collection,
    onSnapshot, 
    query,
    orderBy,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore"
import toast from "react-hot-toast"

interface LinkProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    textColor: string;
}

export function Admin() {
    const [nameInput, setNameInput] = useState("")
    const [urlInput, setUrlInput] = useState("")
    const [textColorInput, setTextColorInput] = useState("#f1f1f1")
    const [backgroundColorInput, setBackgroundColorInput] = useState("")
    const [lista, setLista] = useState<LinkProps[]>([])
    const [username, setUsername] = useState("")

    const [user] = useAuthState(auth)

    useEffect(() => {
    if (!user) return;

    const linksRef = collection(db, "users", user.uid, "links");
    const queryRef = query(linksRef, orderBy("created", "asc"));

    const unsub = onSnapshot(queryRef, (snapshot) => {
        const lista: LinkProps[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            bg: doc.data().bg,
            textColor: doc.data().textColor,
        }));
        setLista(lista);
    });

    async function loadUsername() {
        if (!user?.uid) return
        try {
            const usernameDocRef = doc(db, "users", user.uid);
            const usernameSnap = await getDoc(usernameDocRef);
            const userna = usernameSnap.data()?.username;
            setUsername(userna || "");
        } catch (error) {
            console.error("Erro ao buscar username:", error);
        }
    }

    loadUsername();

    return () => unsub();
    }, [user]); 

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        if (nameInput.trim() === "" || urlInput.trim() === "") {
            toast.error("Preencha todos os campos!", {
                position: "top-right"
            })
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "users", user.uid, "links"), {
            name: nameInput,
            url: urlInput,
            bg: backgroundColorInput,
            textColor: textColorInput,
            created: new Date(),
        }).catch((error) => {
            console.log("Erro ao cadastrar: " + error);
        });

        toast.success('Link cadastrado!', {
            position: "top-right"
        })

        setNameInput("");
        setUrlInput("");
    }

    async function handleDeleteLink(id: string) {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid, "links", id);
        await deleteDoc(docRef);
        toast.success('Link Deletado!', {
            position: "top-right"
        })
    }

    return (
        <>
        <div className="flex flex-col items-center min-h-screen pb-7 px-2">
            <Header/>

            <form className="flex flex-col w-full max-w-xl mt-7 mb-3 px-1" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do link</label>
                <Input
                    placeholder="Digite o nome do link..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />
               
                <label className="text-white font-medium mt-2 mb-2">Url do link</label>
                <Input
                    type="url"
                    placeholder="Digite sua Url..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                />

                <section className="flex my-4 gap-5">
                    <div className="flex gap-3 items-center">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do Link</label>
                        <input 
                            className="bg-white w-7 rounded-sm cursor-pointer"
                            type="color"
                            value={backgroundColorInput} 
                            onChange={(e) => setBackgroundColorInput(e.target.value)}
                        />
                    </div>
                   
                    <div className="flex gap-3 items-center">
                        <label className="text-white font-medium mt-2 mb-2">Cor do Link</label>
                        <input 
                            className="bg-white w-7 rounded-sm cursor-pointer"
                            type="color"
                            value={textColorInput} 
                            onChange={(e) => setTextColorInput(e.target.value)}
                        />
                    </div>
                </section>

                {nameInput !== '' && (
                <div className="flex flex-col items-center justify-start border-gray-100/25 border rounded-md mb-7 p-1">
                    <label className="text-white font-medium mt-2 mb-2">Veja como ta ficando:</label>
                    <article 
                        className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-700 rounded px-1 py-3"
                        style={{marginBottom: 8, marginTop: 8, backgroundColor: backgroundColorInput}}
                        >
                        
                        <p style={{color: textColorInput}} className="font-medium">
                            {nameInput}
                        </p>
                    </article>
                </div>
                )}
            </form>

            <div className="flex gap-1 w-full max-w-xl">
                <button onClick={handleRegister} className="flex-2 mb-7 bg-linear-to-r bg-purple-500 to-blue-600 h-9 rounded-l-md text-white font-medium flex justify-center items-center gap-4 cursor-pointer">
                    Cadastrar
                </button>

                {user && (
                    <button
                        onClick={() => {
                            const publicLink = `${window.location.origin}/user/${username}`;
                            navigator.clipboard.writeText(publicLink);
                            toast.success('Link copiado!', {
                                position: "top-right",
                            });
                        }}
                        className="px-2 bg-blue-600 h-9 font-medium rounded-r-md text-white cursor-pointer"
                    >
                        Copiar link público
                    </button>
               )}
            </div>

            <h2 className="font-bold text-2xl text-white mb-4">
                Meus Links
            </h2>
            
            {lista.map((lista) => {
                return ( 
                    <article key={lista.id} className="flex w-full max-w-xl mt-2 px-1">
                        <div className="flex items-center justify-between w-full rounded py-3 px-3 select-none"
                            style={{background: lista.bg, color: lista.textColor}}
                            >
                            <div>
                                <p className="font-medium">{lista.name}</p>
                                <span className="text-sm">{lista.url}</span>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => handleDeleteLink(lista.id)} className="p-1 rounded-lg cursor-pointer hover:scale-110 duration-150">
                                    <FiTrash size={22} color="#FFF"/>
                                </button>
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
        </>
    )
}