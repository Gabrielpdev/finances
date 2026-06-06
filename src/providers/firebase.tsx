"use client";
import { useState, createContext } from "react";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { IUserContext } from "@/types/data";

import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { createSession } from "@/app/actions/createSession";
import { deleteSession } from "@/app/actions/deleteSession";

const provider = new GoogleAuthProvider();

export const UserContext = createContext({} as IUserContext);

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();

  const [user, setUser] = useState<any>(null);

  const login = async () => {
    const userCred = await signInWithPopup(auth, provider);

    const token = await userCred.user.getIdToken();
    await createSession(token!);

    setUser(userCred.user);
    push("/home");
  };

  const logout = async () => {
    await deleteSession();
    await signOut(auth);
    push("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
