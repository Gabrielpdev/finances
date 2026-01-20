"use client";

import { UserContext } from "@/providers/firebase";
import { useContext } from "react";

export default function NotAllowed() {
  const { logout } = useContext(UserContext);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-center items-center max-w-md w-full m-auto bg-white rounded  p-3">
        <h1 className="text-2xl font-bold mb-4">User not allowed</h1>
        <button
          className="px-4 py-2 bg-red-700 text-white rounded"
          onClick={logout}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
