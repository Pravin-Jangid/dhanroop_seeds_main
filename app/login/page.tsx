"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Admin");
    } catch (err: unknown) {
      // FIXED: Proper type checking for unknown error
      if (err instanceof Error) {
        alert(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        alert((err as { message: string }).message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-80">
        <h2 className="text-xl mb-4">Admin Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}