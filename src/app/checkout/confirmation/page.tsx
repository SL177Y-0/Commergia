"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutConfirmationPage() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order") || "CG-00001";
  const gateway = searchParams.get("gateway") || "stripe";
  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "USD";
  const shipping = searchParams.get("shipping") || "standard";
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("checkout_information");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { firstName?: string; lastName?: string; email?: string };
      setCustomerName(`${parsed.firstName || ""} ${parsed.lastName || ""}`.trim());
      setCustomerEmail(parsed.email || "");
    } catch {
      setCustomerName("");
      setCustomerEmail("");
    }
  }, []);

  return (
    <div className="mx-auto my-12 max-w-2xl rounded-xl border border-gray-200 p-8 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">Order confirmed</p>
      <h1 className="mt-2 text-3xl font-bold">Thank you for your purchase</h1>
      <p className="mt-3 text-sm text-gray-600">Your order number is {order}. A confirmation email has been sent.</p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-700">
        <p>
          <span className="font-semibold">Gateway:</span> {gateway}
        </p>
        <p>
          <span className="font-semibold">Paid:</span> {currency} {Number(amount).toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Shipping method:</span> {shipping}
        </p>
        {customerName ? (
          <p>
            <span className="font-semibold">Customer:</span> {customerName}
          </p>
        ) : null}
        {customerEmail ? (
          <p>
            <span className="font-semibold">Email:</span> {customerEmail}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">View orders</Link>
        </Button>
      </div>
    </div>
  );
}
