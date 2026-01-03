"use client";

import Link from "next/link";
import { parseCookies } from "nookies";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { useStorefrontMutation } from "@/hooks/useStorefront";
import { CUSTOMER_UPDATE, GET_CUSTOMER, GET_CUSTOMER_ORDERS } from "@/graphql/profile";
import { useWishlist } from "@/hooks/useWishlist";

type CustomerResponse = {
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
};

type OrdersResponse = {
  customer: {
    orders: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          processedAt: string;
          totalPrice: { amount: string; currencyCode: string };
          financialStatus: string;
        };
      }>;
    };
  } | null;
};

export default function AccountPage() {
  const token = parseCookies().customerAccessToken;
  const { wishlist } = useWishlist();
  const { mutate, isLoading: isSavingProfile } = useStorefrontMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const customer = useStorefrontQuery<CustomerResponse>(["customer", token], {
    query: GET_CUSTOMER,
    variables: { customerAccessToken: token },
    enabled: Boolean(token),
  });

  const orders = useStorefrontQuery<OrdersResponse>(["customer-orders-summary", token], {
    query: GET_CUSTOMER_ORDERS,
    variables: {
      customerAccessToken: token,
      first: 5,
      sortKey: "PROCESSED_AT",
      reverse: true,
    },
    enabled: Boolean(token),
  });

  const recentOrders = useMemo(() => orders.data?.customer?.orders?.edges || [], [orders.data]);

  useEffect(() => {
    setProfile({
      firstName: customer.data?.customer?.firstName || "",
      lastName: customer.data?.customer?.lastName || "",
      phone: customer.data?.customer?.phone || "",
    });
  }, [customer.data?.customer?.firstName, customer.data?.customer?.lastName, customer.data?.customer?.phone]);

  const saveProfile = async () => {
    if (!token) return;
    try {
      const response = (await mutate({
        query: CUSTOMER_UPDATE,
        variables: {
          customerAccessToken: token,
          customer: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
          },
        },
      })) as {
        customerUpdate: {
          customerUserErrors: Array<{ message: string }>;
        };
      };

      if (response.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(response.customerUpdate.customerUserErrors[0].message || "Failed to update profile.");
      }

      toast.success("Profile updated");
      setIsEditing(false);
      customer.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.");
    }
  };

  if (!token) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-gray-600">Please sign in to access your account dashboard.</p>
        <Link className="mt-4 inline-flex rounded-md bg-gray-900 px-4 py-2 text-white" href="/auth">
          Go to auth
        </Link>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-6">
      <h1 className="text-2xl font-semibold">Account Dashboard</h1>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-gray-200 p-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Profile</h2>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={saveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Input
                value={profile.firstName}
                onChange={(event) => setProfile((previous) => ({ ...previous, firstName: event.target.value }))}
                placeholder="First name"
              />
              <Input
                value={profile.lastName}
                onChange={(event) => setProfile((previous) => ({ ...previous, lastName: event.target.value }))}
                placeholder="Last name"
              />
              <Input
                className="md:col-span-2"
                value={profile.phone}
                onChange={(event) => setProfile((previous) => ({ ...previous, phone: event.target.value }))}
                placeholder="Phone"
              />
              <p className="text-sm text-gray-600 md:col-span-2">{customer.data?.customer?.email}</p>
            </div>
          ) : (
            <>
              <p className="mt-3 text-lg font-semibold">
                {customer.data?.customer?.firstName} {customer.data?.customer?.lastName}
              </p>
              <p className="text-sm text-gray-600">{customer.data?.customer?.email}</p>
              <p className="text-sm text-gray-600">{customer.data?.customer?.phone || "No phone"}</p>
            </>
          )}
        </article>

        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Quick stats</h2>
          <p className="mt-3 text-sm">Orders: {recentOrders.length}</p>
          <p className="text-sm">Wishlist items: {wishlist.length}</p>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link className="text-sm underline underline-offset-4" href="/account/orders">
            View all
          </Link>
        </div>

        <div className="space-y-2">
          {recentOrders.map(({ node }) => (
            <article className="flex items-center justify-between rounded-md border border-gray-100 p-3" key={node.id}>
              <div>
                <p className="text-sm font-semibold">{node.name}</p>
                <p className="text-xs text-gray-500">{new Date(node.processedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {node.totalPrice.currencyCode} {Number(node.totalPrice.amount).toFixed(2)}
                </p>
                <p className="text-xs uppercase text-gray-500">{node.financialStatus}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
