"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewsletterSignupProps = {
  tone?: "dark" | "light";
};

export default function NewsletterSignup({ tone = "dark" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) return;

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setStatus("Subscribed");
      setEmail("");
      return;
    }

    setStatus("Unable to subscribe");
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        className={
          tone === "dark"
            ? "border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-400"
            : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
        }
      />
      <Button
        className={tone === "dark" ? "w-full bg-white text-gray-900 hover:bg-gray-100" : "w-full"}
        type="submit"
      >
        Subscribe
      </Button>
      {status ? (
        <p className={tone === "dark" ? "text-xs text-gray-300" : "text-xs text-gray-600"}>{status}</p>
      ) : null}
    </form>
  );
}
