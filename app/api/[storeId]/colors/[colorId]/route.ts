import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-session";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const color = await prisma.color.findFirst({
      where: {
        id: params.colorId,
        store: {
          id: params.storeId,
          userId: user.id,
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
