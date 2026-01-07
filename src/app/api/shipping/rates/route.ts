import { getShiprocketRates } from "@/lib/integrations/shiprocket";
import { shippingRatesRequestSchema } from "@/lib/api/validation";
import { apiSuccess, getApiContext, handleApiException, parseBody } from "@/lib/api/response";

function fallbackRates(weight: number) {
  const base = 5 + Math.max(0, weight - 1) * 1.5;
  return [
    { id: "standard", label: "Standard (3-7 days)", amount: Number(base.toFixed(2)), estimatedDays: "3-7 days" },
    {
      id: "express",
      label: "Express (2-4 days)",
      amount: Number((base + 6).toFixed(2)),
      estimatedDays: "2-4 days",
    },
    {
      id: "overnight",
      label: "Overnight",
      amount: Number((base + 14).toFixed(2)),
      estimatedDays: "1 day",
    },
  ];
}

export async function POST(request: Request) {
  const context = getApiContext(request);

  try {
    const parsed = await parseBody(request, shippingRatesRequestSchema, context);
    if (!parsed.ok) {
      return parsed.response;
    }

    const originZip = parsed.data.originZip || "10001";
    const destinationZip = parsed.data.destinationZip || parsed.data.destination || originZip;
    const weight = parsed.data.weight || 1;
    const cod = parsed.data.cod || false;

    const liveRates = await getShiprocketRates({
      originZip,
      destinationZip,
      weight,
      cod,
    });

    if (liveRates?.length) {
      return apiSuccess(context, {
        provider: "shiprocket",
        rates: liveRates,
      });
    }

    return apiSuccess(context, {
      provider: "fallback",
      rates: fallbackRates(weight),
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
