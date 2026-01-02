"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import { Button } from "@/components/ui/button";
import SignUp from "@/components/view/Auth/Signup";
import Login from "@/components/view/Auth/Login";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRegister, setShowRegister] = useState(false);

  const customerAccessToken = parseCookies().customerAccessToken;

  useEffect(() => {
    if (!customerAccessToken) return;

    const nextPath = searchParams.get("next");
    router.push(nextPath || "/");
  }, [customerAccessToken, router, searchParams]);

  return (
    <div className="mx-auto my-10 max-w-md rounded-xl border border-gray-200 p-8">
      <h1 className="text-center text-2xl font-semibold">Welcome to Commergia</h1>
      <p className="mt-2 text-center text-sm text-gray-600">Sign in to manage orders, profile, and wishlist.</p>

      <div className="mt-5 grid grid-cols-1 gap-2">
        <Button type="button" variant="outline" className="w-full">
          Continue with Google (Coming Soon)
        </Button>
        <Button type="button" variant="outline" className="w-full">
          Continue with Apple (Coming Soon)
        </Button>
      </div>

      {showRegister ? (
        <SignUp setShowRegister={setShowRegister} />
      ) : (
        <Login setShowRegister={setShowRegister} />
      )}
    </div>
  );
}
