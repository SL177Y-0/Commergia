"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartActions } from "@/lib/atoms/cart";

const informationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(3),
  phone: z.string().min(7),
});

type InformationForm = z.infer<typeof informationSchema>;

type CheckoutFormProps = {
  step: "information" | "shipping" | "payment";
};

const INFORMATION_KEY = "checkout_information";
const SHIPPING_KEY = "checkout_shipping";

export default function CheckoutForm({ step }: CheckoutFormProps) {
  const router = useRouter();
  const { cart } = useCartActions();

  const informationForm = useForm<InformationForm>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingRates, setShippingRates] = useState<Array<{ id: string; label: string; amount: number }>>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  useEffect(() => {
    const rawInformation = localStorage.getItem(INFORMATION_KEY);

    if (rawInformation) {
      try {
        const parsed = JSON.parse(rawInformation) as InformationForm;
        informationForm.reset(parsed);
      } catch {
        localStorage.removeItem(INFORMATION_KEY);
      }
    }

    const rawShipping = localStorage.getItem(SHIPPING_KEY);
    if (rawShipping) {
      try {
        const parsed = JSON.parse(rawShipping) as { method: string };
        if (parsed.method) {
          setShippingMethod(parsed.method);
        }
      } catch {
        localStorage.removeItem(SHIPPING_KEY);
      }
    }
  }, [informationForm]);

  useEffect(() => {
    const hydrateServerSession = async () => {
      const response = await fetch("/api/checkout/session", { cache: "no-store" });
      if (!response.ok) return;

      const payload = (await response.json()) as {
        data?: {
          session?: {
            information?: InformationForm;
            shippingMethod?: string;
            currency?: "USD" | "INR";
          };
        };
      };
      const session = payload.data?.session;
      if (!session) return;

      if (session.information) {
        informationForm.reset({
          email: session.information.email || "",
          firstName: session.information.firstName || "",
          lastName: session.information.lastName || "",
          address: session.information.address || "",
          city: session.information.city || "",
          state: session.information.state || "",
          zip: session.information.zip || "",
          phone: session.information.phone || "",
        });
      }

      if (session.shippingMethod) {
        setShippingMethod(session.shippingMethod);
      }

      if (session.currency) {
        setCurrency(session.currency);
      }
    };

    hydrateServerSession();
  }, [informationForm]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.cookie.includes("preferredCurrency=INR")) {
      setCurrency("INR");
    }
  }, []);

  useEffect(() => {
    if (step !== "shipping") return;

    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weight: 1,
            originZip: "10001",
            destinationZip: informationForm.getValues("zip") || "10001",
          }),
        });

        if (!response.ok) return;
        const payload = (await response.json()) as {
          rates?: Array<{ id: string; label: string; amount: number }>;
          data?: { rates?: Array<{ id: string; label: string; amount: number }> };
        };
        const rates = payload.rates ?? payload.data?.rates ?? [];
        setShippingRates(Array.isArray(rates) ? rates : []);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, [step, informationForm]);

  const selectedShippingLabel = useMemo(() => {
    const selected = shippingRates.find((rate) => rate.id === shippingMethod);
    return selected ? `${selected.label} - $${selected.amount.toFixed(2)}` : "Standard";
  }, [shippingMethod, shippingRates]);

  const submitInformation = informationForm.handleSubmit((values) => {
    localStorage.setItem(INFORMATION_KEY, JSON.stringify(values));
    fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        information: values,
        currency,
      }),
    }).catch(() => null);
    router.push("/checkout/shipping");
  });

  const submitShipping = () => {
    localStorage.setItem(SHIPPING_KEY, JSON.stringify({ method: shippingMethod }));
    fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingMethod,
      }),
    }).catch(() => null);
    router.push("/checkout/payment");
  };

  const submitPayment = async () => {
    setPaymentError(null);
    setSubmitting(true);
    try {
      const parsedTotal = Number(cart.cost.totalAmount.amount || 0);
      const totalAmount = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : 100;
      const endpoint = currency === "INR" ? "/api/payments/razorpay/create-order" : "/api/payments/stripe/create-intent";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": `checkout-${Date.now()}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency,
          meta: {
            shippingMethod,
          },
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        data?: Record<string, unknown>;
        error?: { message?: string };
      };
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error?.message || "Payment initialization failed");
      }

      const data = payload.data || {};
      const order =
        data.id ||
        data.orderId ||
        data.paymentIntentId ||
        data.paymentIntent ||
        `${currency === "INR" ? "order" : "pi"}_${Date.now()}`;

      router.push(
        `/checkout/confirmation?order=${encodeURIComponent(String(order))}&gateway=${encodeURIComponent(
          currency === "INR" ? "razorpay" : "stripe"
        )}&amount=${encodeURIComponent(String(totalAmount.toFixed(2)))}&currency=${currency}&shipping=${encodeURIComponent(
          shippingMethod
        )}`
      );
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to initialize payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "information") {
    return (
      <form className="space-y-4 rounded-xl border border-gray-200 p-6" onSubmit={submitInformation}>
        <h1 className="text-xl font-semibold">Checkout - Information</h1>
        <Input placeholder="Email" {...informationForm.register("email")} />
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="First name" {...informationForm.register("firstName")} />
          <Input placeholder="Last name" {...informationForm.register("lastName")} />
        </div>
        <Input placeholder="Address" {...informationForm.register("address")} />
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="City" {...informationForm.register("city")} />
          <Input placeholder="State" {...informationForm.register("state")} />
          <Input placeholder="ZIP" {...informationForm.register("zip")} />
        </div>
        <Input placeholder="Phone" {...informationForm.register("phone")} />

        <Button type="submit">Continue to shipping</Button>
      </form>
    );
  }

  if (step === "shipping") {
    return (
      <section className="space-y-4 rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-semibold">Checkout - Shipping</h1>
        <p className="text-sm text-gray-600">Select a shipping option based on real-time rates.</p>

        {loadingRates ? <p className="text-sm">Loading shipping rates...</p> : null}

        <div className="space-y-2">
          {shippingRates.map((rate) => (
            <label className="flex items-center justify-between rounded-md border border-gray-200 p-3" key={rate.id}>
              <span className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="shipping"
                  value={rate.id}
                  checked={shippingMethod === rate.id}
                  onChange={(event) => setShippingMethod(event.target.value)}
                />
                {rate.label}
              </span>
              <span className="text-sm font-medium">${rate.amount.toFixed(2)}</span>
            </label>
          ))}
        </div>

        <Button onClick={submitShipping}>Continue to payment</Button>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 p-6">
      <h1 className="text-xl font-semibold">Checkout - Payment</h1>
      <p className="text-sm text-gray-600">
        Payment route is selected automatically by currency. Current shipping method: {selectedShippingLabel}
      </p>

      {(() => {
        const parsedTotal = Number(cart.cost.totalAmount.amount || 0);
        const payableTotal = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : 100;
        return (
          <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
            <p>
              Order total: {cart.cost.totalAmount.currencyCode} {payableTotal.toFixed(2)}
            </p>
            <p>Gateway: {currency === "INR" ? "Razorpay" : "Stripe"}</p>
          </div>
        );
      })()}

      {paymentError ? <p className="text-sm text-red-600">{paymentError}</p> : null}

      <Button onClick={submitPayment} disabled={submitting}>
        {submitting ? "Processing..." : "Pay now"}
      </Button>
    </section>
  );
}
