import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../services/firebase.connection"
import type { User } from "firebase/auth"

export async function syncUsernameWithName(user: User) {
  const userRef = doc(db, "users", user.uid)
  const profileInfoRef = doc(db, "users", user.uid, "profile", "info")

  const profileDoc = await getDoc(profileInfoRef)
  if (!profileDoc.exists()) {
    console.error("profile/info não existe.")
    return
  }

  const nameFromProfile = profileDoc.data().name
  if (!nameFromProfile) {
    console.error("Campo name vazio.")
    return
  }

  const baseUsername = nameFromProfile.toLowerCase().replace(/\s/g, "-")

  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", baseUsername))
  const existing = await getDocs(q)

  let finalUsername = baseUsername

  const isTakenByOtherUser = !existing.empty && existing.docs.some(doc => doc.id !== user.uid)
  if (isTakenByOtherUser) {
    finalUsername = `${baseUsername}-${Date.now()}`
    console.warn("Nome de usuário já existe, gerado novo:", finalUsername)
  }

  await setDoc(userRef, {
    username: finalUsername
  }, { merge: true })

  console.log("Username sincronizado:", finalUsername)
}
