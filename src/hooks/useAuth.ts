"use client";

import { useAuthAtom } from "@/lib/atoms/auth";

export function useAuth() {
  return useAuthAtom();
}
