"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  const onChange = (key: keyof ContactPayload, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
      return;
    }

    setStatus("Unable to send message.");
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Name" value={form.name} onChange={(event) => onChange("name", event.target.value)} required />
        <Input type="email" placeholder="Email" value={form.email} onChange={(event) => onChange("email", event.target.value)} required />
      </div>
      <Input placeholder="Subject" value={form.subject} onChange={(event) => onChange("subject", event.target.value)} required />
      <textarea
        className="min-h-36 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        placeholder="Message"
        value={form.message}
        onChange={(event) => onChange("message", event.target.value)}
        required
      />
      <Button type="submit">Send message</Button>
      {status ? <p className="text-sm text-gray-600">{status}</p> : null}
    </form>
  );
}
