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
  const redirectRef = useRef<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    setLoading(true);
    const userCred = await signInWithPopup(auth, provider);

    const token = await userCred.user.getIdToken();
    await createSession(token!);

    setUser(userCred.user);
  };

  const logout = async () => {
    await deleteSession();
    await signOut(auth);
    setIsUserAllowed(false);
  };

  // // Handle redirects immediately when needed, not via state
  // useEffect(() => {
  //   if (redirectRef.current) {
  //     const path = redirectRef.current;
  //     redirectRef.current = null;
  //     push(path);
  //   }
  // }, [push]);

  // useEffect(() => {
  //   isMountedRef.current = true;

  //   const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
  //     if (!isMountedRef.current) return;

  //     if (!user) {
  //       setLoading(false);
  //       setIsUserAllowed(false);
  //       redirectRef.current = "/login";
  //       // Schedule redirect outside of this callback
  //       setTimeout(() => {
  //         if (redirectRef.current) {
  //           const path = redirectRef.current;
  //           redirectRef.current = null;
  //           push(path);
  //         }
  //       }, 0);
  //       return;
  //     }

  //     try {
  //       const token = await user.getIdToken();
  //       await createSession(token!);
  //       const result = await checkUserToken();

  //       if (!result.valid) {
  //         if (result.reason === "expired") {
  //           const refreshedToken = await user.getIdToken(true);
  //           await createSession(refreshedToken!);
  //           const retryResult = await checkUserToken();

  //           if (!retryResult.valid) {
  //             setLoading(false);
  //             setIsUserAllowed(false);
  //             redirectRef.current = "/not-allowed";
  //             setTimeout(() => {
  //               if (redirectRef.current) {
  //                 const path = redirectRef.current;
  //                 redirectRef.current = null;
  //                 push(path);
  //               }
  //             }, 0);
  //             return;
  //           }
  //         } else {
  //           setLoading(false);
  //           setIsUserAllowed(false);
  //           redirectRef.current = "/not-allowed";
  //           setTimeout(() => {
  //             if (redirectRef.current) {
  //               const path = redirectRef.current;
  //               redirectRef.current = null;
  //               push(path);
  //             }
  //           }, 0);
  //           return;
  //         }
  //       }

  //       setUser(user);
  //       setIsUserAllowed(true);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Auth error:", error);
  //       setLoading(false);
  //       setIsUserAllowed(false);
  //     }
  //   });

  //   return () => {
  //     isMountedRef.current = false;
  //     unsubscribe();
  //   };
  // }, [push]);

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
