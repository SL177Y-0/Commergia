"use client";

import { atom, useAtom } from "jotai";

export type AuthState = {
  token: string | null;
  email: string | null;
};

const authAtom = atom<AuthState>({
  token: null,
  email: null,
});

export function useAuthAtom() {
  const [auth, setAuth] = useAtom(authAtom);

  return {
    auth,
    setToken: (token: string | null, email?: string | null) =>
      setAuth({ token, email: email || auth.email }),
    clear: () => setAuth({ token: null, email: null }),
  };
}
