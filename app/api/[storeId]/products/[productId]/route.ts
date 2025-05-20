import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  params: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { storeId, productId } = await params.params;
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: storeId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        isFeatured: true,
        isArchived: true,
        sizeId: true,
        colorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return new NextResponse("Not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    return NextResponse.json(product, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
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
