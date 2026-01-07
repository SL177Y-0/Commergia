import { getShiprocketTracking } from "@/lib/integrations/shiprocket";
import { apiSuccess, getApiContext, handleApiException } from "@/lib/api/response";

type TrackParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: TrackParams) {
  const context = getApiContext(request);

  try {
    const { id } = await params;
    const liveTrack = await getShiprocketTracking(id);

    if (liveTrack?.length) {
      return apiSuccess(context, {
        provider: "shiprocket",
        trackingId: id,
        status: liveTrack[0]?.current_status || "in_transit",
        updatedAt: new Date().toISOString(),
        checkpoints: liveTrack.map((entry) => ({
          title: entry.activity || entry.current_status || "Update",
          at: entry.date || new Date().toISOString(),
          location: entry.location || "",
        })),
      });
    }

    return apiSuccess(context, {
      provider: "fallback",
      trackingId: id,
      status: "in_transit",
      updatedAt: new Date().toISOString(),
      checkpoints: [
        { title: "Order packed", at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), location: "" },
        { title: "Picked up by courier", at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), location: "" },
        { title: "In transit", at: new Date().toISOString(), location: "" },
      ],
    });
  } catch (error) {
    return handleApiException(error, context);
  }
}
