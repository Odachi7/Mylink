import { Link, useLocation } from "react-router-dom"
import { BiLogOut } from "react-icons/bi"

import { auth, db } from "../../services/firebase.connection"
import { signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc } from "firebase/firestore"
import toast from "react-hot-toast"

async function handleLogout() {
    await signOut(auth)
    toast.success('Você saiu da conta!', {
        position: "top-right"
    })
}

export function Header() {
    const [activeTab, setActiveTab] = useState('')
    const [user] = useAuthState(auth)
    const location = useLocation()
    const [username, setUsername] = useState("")

    useEffect(() => {
        const currentPath = location.pathname

        if (currentPath.startsWith("/user/")) {
            setActiveTab('home');
        } else if (currentPath === "/admin") {
            setActiveTab('links');
        } else if (currentPath === "/admin/social") {
            setActiveTab('redesSociais');
        } else {
            setActiveTab('');
        }
    }, [location.pathname])

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
        <header className="w-full max-w-2xl mt-4 px-1">
            <nav className="bg-white h-12 w-full flex items-center justify-between px-3 rounded-md">
                <div className="flex gap-4 font-medium">
                    <Link to={`/user/${username}`} className={`select-none cursor-pointer hover:scale-105 duration-200 ${activeTab === "home" ? "text-blue-700 select-none cursor-pointer hover:scale-106 duration-200" : "text-black"}`}>
                        Home
                    </Link>
                    
                    <Link to="/admin" className={`select-none cursor-pointer hover:scale-105 duration-200 ${activeTab === "links" ? "text-blue-700 select-none cursor-pointer hover:scale-106 duration-200" : "text-black"}`}>
                        Links
                    </Link>
                    
                    <Link to="/admin/social" className={`select-none cursor-pointer hover:scale-105 duration-200 ${activeTab === "redesSociais" ? "text-blue-700 select-none cursor-pointer hover:scale-106 duration-200" : "text-black"}`}>
                        Redes Sociais
                    </Link>
                </div>

                <button onClick={handleLogout} className="text-3xl text-red-600 cursor-pointer">
                    <BiLogOut/>
                </button>
            </nav>
        </header>
    )
}