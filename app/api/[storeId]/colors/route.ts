import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const colors = await prisma.color.findMany({
      where: {
        store: {
          id: params.storeId,
        },
      },
    });

    return NextResponse.json(colors, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}
