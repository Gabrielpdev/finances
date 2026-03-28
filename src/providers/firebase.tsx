"use client";
import { useState, createContext, useEffect, useRef } from "react";

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
  const { push } = useRouter();
  const isMountedRef = useRef(false);

  const [user, setUser] = useState<any>(null);
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

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

  // Handle redirects in a separate effect
  useEffect(() => {
    if (redirectTo) {
      push(redirectTo);
    }
  }, [redirectTo, push]);

  useEffect(() => {
    isMountedRef.current = true;

    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (!isMountedRef.current) return;

      console.log(user);

      if (!user) {
        setLoading(false);
        setIsUserAllowed(false);
        setRedirectTo("/login");
        return;
      }

      try {
        const token = await user.getIdToken();
        await createSession(token!);
        const result = await checkUserToken();

        if (!result.valid) {
          if (result.reason === "expired") {
            const refreshedToken = await user.getIdToken(true);
            await createSession(refreshedToken!);
            const retryResult = await checkUserToken();

            if (!retryResult.valid) {
              setLoading(false);
              setIsUserAllowed(false);
              setRedirectTo("/not-allowed");
              return;
            }
          } else {
            setLoading(false);
            setIsUserAllowed(false);
            setRedirectTo("/not-allowed");
            return;
          }
        }

        setUser(user);
        setIsUserAllowed(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setLoading(false);
        setIsUserAllowed(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
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
