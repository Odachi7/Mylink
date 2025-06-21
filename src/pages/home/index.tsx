import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../services/firebase.connection";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Social } from "../../components/Social";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { HeaderHome } from "../../components/headerHome";
import toast from "react-hot-toast";


interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  textColor: string;
}

interface SocialProps {
  id: string;
  name: string;
  url: string;
}

export function Home() {
  const { username } = useParams<{ username: string }>()
  const [uid, setUid] = useState("")
  const [user] = useAuthState(auth);
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [social, setSocial] = useState<SocialProps[]>([]);
  const [name, setName] = useState("Adicione um nome");
  const [subtitle, setSubtitle] = useState("Meus Links 👇");
  const navigate = useNavigate()

  const isOwner = user?.uid === uid;

  useEffect(() => {
    async function fetchUidByUsername() {
      if (!username) return;

      const q = query(collection(db, "users"), where("username", "==", username));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setUid(snapshot.docs[0].id); 
      } else {
        navigate("*", { replace: true })
      }
    } 

    fetchUidByUsername();
  }, [username]);

  useEffect(() => {
    async function loadProfile() {
      if (!uid) return;
      const docRef = doc(db, "users", uid, "profile", "info");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name);
        setSubtitle(data.subtitle || "Veja meus links 👇");
      }
    }
    loadProfile();
  }, [uid]);

  useEffect(() => {
    async function loadLinks() {
      if (!uid) return;
      const linkRef = collection(db, "users", uid, "links");
      const queryRef = query(linkRef, orderBy("created", "asc"));
      const snapshot = await getDocs(queryRef);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url,
        bg: doc.data().bg,
        textColor: doc.data().textColor
      }));
      setLinks(lista);
    }
    loadLinks();
  }, [uid]);

  useEffect(() => {
    async function loadSocial() {
      if (!uid) return;
      const socialRef = collection(db, "users", uid, "social");
      const queryRef = query(socialRef, orderBy("created", "asc"));
      const snapshot = await getDocs(queryRef);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url
      }));
      setSocial(lista);
    }
    loadSocial();
  }, [uid]);

  async function handleBlur(e: React.FocusEvent<HTMLElement>) {
    if (!isOwner) return;

    const { id, innerText } = e.currentTarget;
    const data: any = {};

    if (id === "name") {
      const formattedName = innerText.toLowerCase().replace(/\s/g, "-");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", formattedName));
      const existing = await getDocs(q);

      const nameIsTaken = !existing.empty && existing.docs.some(doc => doc.id !== uid);

      if (nameIsTaken) {
        toast.error("Esse nome de Usuário já está em uso! Escolha outro.", {
          position: "top-right"
        })
        return; 
      }

      if(innerText !== name) {
        setName(innerText);
        data.name = innerText;
        toast.success(`Nome atualizado com sucesso!`, {
          position: "top-right"
        })
      }

      await setDoc(doc(db, "users", uid!), { username: formattedName }, { merge: true });
    } 
    else if (id === "subtitle") {
      if (subtitle !== innerText) {
        setSubtitle(innerText);
        data.subtitle = innerText;
        toast.success(`Atualizado com sucesso!`, {
          position: "top-right"
        })
      }
    }

    if (Object.keys(data).length > 0) {
      await setDoc(doc(db, "users", uid!, "profile", "info"), data, { merge: true });
    }
  }


  return (
    <>
      <HeaderHome />
      <div className="flex flex-col w-full justify-center items-center py-4">
        <h1
          id="name"
          contentEditable={isOwner}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="text-white text-4xl md:text-5xl font-bold mb-5 mt-20"
        >
          {name}
        </h1>

        <span
          id="subtitle"
          contentEditable={isOwner}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="text-gray-50 md:text-xl mb-15 font-medium"
        >
          {subtitle}
        </span>

        <main className="flex flex-col max-w-xl w-11/12 text-center">
          {links.map((e) => (
            <section
              key={e.id}
              style={{ background: e.bg }}
              className="bg-white w-full mb-4 py-2 rounded-lg transition-all hover:scale-105 duration-300"
            >
              <a href={e.url} target="_blank" rel="noreferrer">
                <p
                  style={{ color: e.textColor }}
                  className="text-base font-medium md:text-lg select-none cursor-pointer"
                >
                  {e.name}
                </p>
              </a>
            </section>
          ))}

          <footer className="flex justify-center gap-3 my-4">
            {social.map((item) => {
              let icon = null;
              if (item.name.toLowerCase() === "instagram") icon = <FaInstagram size={35} color="#FFF" />;
              else if (item.name.toLowerCase() === "facebook") icon = <FaFacebook size={35} color="#FFF" />;
              else if (item.name.toLowerCase() === "linkedin") icon = <FaLinkedin size={35} color="#FFF" />;
              else if (item.name.toLowerCase() === "youtube") icon = <FaYoutube size={35} color="#FFF" />;

              return (
                <Social key={item.id} url={item.url}>
                  {icon}
                </Social>
              );
            })}
          </footer>
        </main>
      </div>
    </>
  );
}
