import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/dal/bookings";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/bookings/slots?date=YYYY-MM-DD&serviceId=uuid
 * Returns available time slots for a given date and service.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: "date and serviceId are required" },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId)) {
      return NextResponse.json(
        { error: "Invalid serviceId format" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(date, serviceId);
    return NextResponse.json(slots);
  } catch (err) {
    logger.error("GET /api/bookings/slots error", {
      error: err instanceof Error ? err.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
