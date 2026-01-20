"use client";

import { UserContext } from "@/providers/firebase";
import Image from "next/image";
import { useContext } from "react";

export default function Login() {
  const { login } = useContext(UserContext);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-center items-center max-w-md w-full m-auto bg-white rounded p-3 py-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Login with Google
        </h1>
        <button
          className="flex justify-between text-xl items-center gap-3 px-4 py-2 bg-gray-700 w-36 text-white rounded"
          onClick={login}
        >
          LOGIN
          <Image
            src="/google.svg"
            alt="google"
            width={32}
            height={32}
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  );
}
