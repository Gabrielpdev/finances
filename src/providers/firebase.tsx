"use client";
import { useState, createContext, useEffect } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { IUserContext } from "@/types/data";

import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { checkUserToken } from "@/app/actions/checkUserToken";
import { createSession } from "@/app/actions/createSession";
import { deleteSession } from "@/app/actions/deleteSession";

const provider = new GoogleAuthProvider();

export const UserContext = createContext({} as IUserContext);

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { replace } = useRouter();

  const [user, setUser] = useState<any>(null);

  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    setLoading(true);

    const userCred = await signInWithPopup(auth, provider);
    setUser(userCred.user);
  };

  const logout = async () => {
    await deleteSession();
    await signOut(auth);
    setIsUserAllowed(false);
  };

  const onChangeAuth = async (user: User | null) => {
    if (!user) {
      replace("/login");
      setLoading(false);
      return;
    }

    const token = await user.getIdToken();
    await createSession(token!);

    const isAllowed = await checkUserToken();

    if (!isAllowed) {
      setLoading(false);
      setIsUserAllowed(false);
      replace("/not-allowed");
      return;
    }

    setIsUserAllowed(true);
    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged(onChangeAuth);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        isUserAllowed,
        user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
