"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie } from "nookies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorefrontMutation } from "@/hooks/useStorefront";
import { CUSTOMER_RESET_BY_URL } from "@/graphql/auth";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const { mutate } = useStorefrontMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = String(params.token || "");
  const resetUrl = useMemo(() => {
    const decoded = decodeURIComponent(token);
    if (/^https?:\/\//.test(decoded)) return decoded;

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    if (!domain) return "";
    return `https://${domain}/account/reset/${token}`;
  }, [token]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!resetUrl) {
      toast.error("Invalid or unsupported reset token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = (await mutate({
        query: CUSTOMER_RESET_BY_URL,
        variables: {
          resetUrl,
          password,
        },
      })) as {
        customerResetByUrl: {
          customerAccessToken?: { accessToken: string };
          customerUserErrors: Array<{ message: string }>;
        };
      };

      if (response.customerResetByUrl.customerUserErrors.length > 0) {
        throw new Error(response.customerResetByUrl.customerUserErrors[0].message || "Unable to reset password.");
      }

      const accessToken = response.customerResetByUrl.customerAccessToken?.accessToken;
      if (accessToken) {
        setCookie(null, "customerAccessToken", accessToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }

      toast.success("Password updated successfully.");
      router.push("/account");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-gray-200 p-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <p className="mt-2 text-sm text-gray-600">Update your password and continue to your account.</p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <Input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>

      <Link className="mt-4 inline-flex text-sm underline underline-offset-4" href="/auth">
        Back to login
      </Link>
    </div>
  );
}
