import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  req: Request,
  params: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  try {
    const { storeId, categoryId } = await params.params;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        store: {
          id: storeId,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            size: {
              select: {
                id: true,
                name: true,
              },
            },
            color: {
              select: {
                id: true,
                name: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return new NextResponse("Not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    return NextResponse.json(category, {
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

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
