import { env } from "@/lib/env";

type ShiprocketTokenCache = {
  token: string;
  expiresAt: number;
} | null;

let tokenCache: ShiprocketTokenCache = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

type ShippingRate = {
  id: string;
  label: string;
  amount: number;
  estimatedDays?: string;
};

async function getShiprocketToken() {
  if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
    return null;
  }

  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: env.SHIPROCKET_EMAIL,
      password: env.SHIPROCKET_PASSWORD,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { token?: string };
  if (!payload.token) {
    return null;
  }

  tokenCache = {
    token: payload.token,
    expiresAt: Date.now() + 1000 * 60 * 55,
  };

  return payload.token;
}

export async function getShiprocketRates(input: {
  originZip: string;
  destinationZip: string;
  weight: number;
  cod: boolean;
}): Promise<ShippingRate[] | null> {
  const token = await getShiprocketToken();
  if (!token) {
    return null;
  }

  const params = new URLSearchParams({
    pickup_postcode: input.originZip,
    delivery_postcode: input.destinationZip,
    weight: String(input.weight),
    cod: input.cod ? "1" : "0",
  });

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/serviceability/?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    data?: {
      available_courier_companies?: Array<{
        courier_company_id: number;
        courier_name: string;
        rate: number | string;
        etd?: string;
      }>;
    };
  };

  const couriers = payload.data?.available_courier_companies || [];
  if (!couriers.length) {
    return null;
  }

  return couriers.slice(0, 5).map((courier) => ({
    id: String(courier.courier_company_id),
    label: courier.courier_name,
    amount: Number(courier.rate || 0),
    estimatedDays: courier.etd,
  }));
}

export async function getShiprocketTracking(awb: string) {
  const token = await getShiprocketToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${encodeURIComponent(awb)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    tracking_data?: {
      shipment_track?: Array<{
        awb_code?: string;
        current_status?: string;
        activity?: string;
        date?: string;
        location?: string;
      }>;
    };
  };

  return payload.tracking_data?.shipment_track || null;
}
