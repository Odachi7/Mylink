import { Link } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../services/firebase.connection"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"


export function NotFound() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState("")
    const [signed, setSigned] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            
            if (user) {
                setSigned(true)

            } else {
                setSigned(false)
            }
        })

        return () => {
            unsub()
        }

    }, [])

    useEffect(() => {
            async function loadUsername() {
                if (user) {
                    const docRef = doc(db, "users", user.uid)
                    const snap = await getDoc(docRef)
                    if (snap.exists()) {
                        const data = snap.data()
                        setUsername(data.username)
                    }
                }
            }
            loadUsername()
    }, [user])
    
    return (
        <div className="flex flex-col w-full items-center mt-5">
            {signed && (
                <Link to={`/user/${username}`}>
                    <h1 className="text-white text-4xl font-black mb-20">
                        My<span className="bg-linear-to-r bg-purple-500 to-blue-500 bg-clip-text text-transparent">Link</span>
                    </h1>
                </Link>
            )}

            {!signed && (
                <Link to={`/login`}>
                    <h1 className="text-white text-4xl font-black mb-20">
                        My<span className="bg-linear-to-r bg-purple-500 to-blue-500 bg-clip-text text-transparent">Link</span>
                    </h1>
                </Link>
            )}
            
            <div className="min-w-3xs -mb-7 mt-50">
                <p className="bg-purple-500 bg-clip-text text-transparent select-none">
                    ERROR
                </p>
            </div>

            <span className="text-9xl font-bold bg-linear-to-r bg-purple-500 to-blue-500 bg-clip-text text-transparent">
                404
            </span>

            <p className="mt-2 text-xl text-zinc-200">
                Página não encontrada
            </p>

            {signed && (
                <Link to={`/user/${username}`} className="mt-5 bg-zinc-700 text-white font-medium px-3 w-30 text-center py-2 rounded-xl">
                    Home
                </Link>
            )}

            {!signed && (
                <Link to={`/login`} className="mt-5 bg-zinc-700 text-white font-medium px-3 py-2 rounded-xl">
                    Fazer Login
                </Link>
            )}
        </div>
    )
}