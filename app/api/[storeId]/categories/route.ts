import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  params: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params.params;
    const categories = await prisma.category.findMany({
      where: {
        store: {
          id: storeId,
        },
      },
      include: {
        products: {
          include: { size: true, color: true, images: true },
        },
      },
    });

    return NextResponse.json(categories, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}
