import { useState, useEffect } from "react"
import { auth } from "../../services/firebase.connection";
import { onAuthStateChanged } from "firebase/auth"
import { Link } from "react-router-dom";
import { Logo } from "../../components/logo"
import { Header } from "../header";

export function HeaderHome() {
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

    return (
        <>
            {signed && (
                <div className="flex w-full justify-center items-center px-2">
                    <Header/>
                </div>
            )}

            {!signed && (
                <div className="flex items-center justify-between px-8 pt-2">
                    <Logo/>
                    
                   <div className="flex gap-3">
                     <Link to={"/login"} className="text-xl text-white select-none cursor-pointer hover:scale-105 duration-150">
                        Login
                    </Link>  

                     <Link to={"/signup"} className="text-xl text-white select-none cursor-pointer hover:scale-105 duration-150">
                        Signup
                    </Link>  
                   </div>
                </div>
            )}
        
        </>
    )
}