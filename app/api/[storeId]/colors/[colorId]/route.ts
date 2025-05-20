import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  params: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { storeId, colorId } = await params.params;
    const color = await prisma.color.findFirst({
      where: {
        id: colorId,
        store: {
          id: storeId,
        },
      },
      select: {
        id: true,
        name: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!color) {
      return new NextResponse("Not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    return NextResponse.json(color, {
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

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
