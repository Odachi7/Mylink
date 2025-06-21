import { doc, setDoc, query, where, collection, getDocs } from "firebase/firestore"
import type { User } from "firebase/auth"
import { db } from "../services/firebase.connection"

export async function createInitialUsername(user: User) {
  if (!user?.uid) return

  const base =
    user.displayName?.toLowerCase().replace(/\s/g, "-") ||
    user.email?.split("@")[0].toLowerCase().replace(/\s/g, "-") ||
    "user"

  let suggested = `${base}-${Math.floor(Math.random() * 10000)}`

  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", suggested))
  const existing = await getDocs(q)

  if (!existing.empty) {
    suggested = `${suggested}-${Date.now()}`
  }

  const userRef = doc(db, "users", user.uid)
  await setDoc(userRef, {
    username: suggested
  }, { merge: true })

  console.log("Username inicial gerado:", suggested)
}