"use client";

import Link from "next/link";
import { useState } from "react";
import { Fragment } from "react";
import { parseCookies } from "nookies";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GET_CUSTOMER_ORDERS } from "@/graphql/profile";

type OrdersResponse = {
  customer: {
    orders: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          orderNumber: number;
          processedAt: string;
          financialStatus: string;
          fulfillmentStatus: string;
          totalPrice: { amount: string; currencyCode: string };
          lineItems: {
            nodes: Array<{
              title: string;
              currentQuantity: number;
              variant?: {
                product?: {
                  handle?: string;
                };
              };
            }>;
          };
          shippingAddress?: {
            name?: string;
            address1?: string;
            address2?: string;
            city?: string;
            country?: string;
          } | null;
        };
      }>;
    };
  } | null;
};

export default function AccountOrdersPage() {
  const token = parseCookies().customerAccessToken;
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});

  const orders = useStorefrontQuery<OrdersResponse>(["customer-orders", token], {
    query: GET_CUSTOMER_ORDERS,
    variables: {
      customerAccessToken: token,
      first: 50,
      sortKey: "PROCESSED_AT",
      reverse: true,
    },
    enabled: Boolean(token),
  });

  if (!token) {
    return <p className="my-10 text-sm text-gray-600">Sign in to view your orders.</p>;
  }

  const orderEdges = orders.data?.customer?.orders?.edges || [];

  return (
    <div className="my-8 space-y-5">
      <h1 className="text-2xl font-semibold">Order History</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {orderEdges.map(({ node }) => {
              const isExpanded = Boolean(expandedOrderIds[node.id]);
              return (
                <Fragment key={node.id}>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{node.name}</td>
                    <td className="px-4 py-3">{new Date(node.processedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <p>{node.financialStatus}</p>
                      <p className="text-xs text-gray-500">{node.fulfillmentStatus || "Unfulfilled"}</p>
                    </td>
                    <td className="px-4 py-3">
                      {node.lineItems.nodes.reduce((sum, item) => sum + item.currentQuantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {node.totalPrice.currencyCode} {Number(node.totalPrice.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-xs font-semibold uppercase tracking-wide text-gray-700 underline underline-offset-2"
                        onClick={() =>
                          setExpandedOrderIds((previous) => ({
                            ...previous,
                            [node.id]: !previous[node.id],
                          }))
                        }
                      >
                        {isExpanded ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr className="border-t border-gray-100 bg-gray-50/60">
                      <td className="px-4 py-3 text-xs text-gray-700" colSpan={6}>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-gray-500">Items</p>
                            <ul className="mt-1 space-y-1">
                              {node.lineItems.nodes.map((item, index) => (
                                <li key={`${node.id}-${index}`} className="flex items-center justify-between">
                                  <span>
                                    {item.title} x{item.currentQuantity}
                                  </span>
                                  {item.variant?.product?.handle ? (
                                    <Link
                                      className="text-gray-600 underline underline-offset-2"
                                      href={`/product/${item.variant.product.handle}`}
                                    >
                                      View
                                    </Link>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold uppercase tracking-wide text-gray-500">Shipping</p>
                            <p className="mt-1">
                              {node.shippingAddress?.name || "Name unavailable"}
                              <br />
                              {node.shippingAddress?.address1 || ""}
                              {node.shippingAddress?.address2 ? `, ${node.shippingAddress.address2}` : ""}
                              <br />
                              {node.shippingAddress?.city || ""}, {node.shippingAddress?.country || ""}
                            </p>
                            <Link
                              className="mt-2 inline-flex text-gray-700 underline underline-offset-2"
                              href={`/api/shipping/track/${node.orderNumber}`}
                              target="_blank"
                            >
                              Track shipment
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
