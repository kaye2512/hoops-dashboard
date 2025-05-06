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
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });

    if (!store) {
      return new NextResponse("Not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: store.id,
      },
      select: {
        id: true,
        label: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(billboards, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);
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
