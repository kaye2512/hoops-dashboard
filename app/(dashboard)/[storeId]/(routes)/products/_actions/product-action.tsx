"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { ZSAError } from "zsa";

export const createProductAction = action
  .input(
    z.object({
      name: z.string().min(1),
      images: z.object({ url: z.string() }).array(),
      price: z.coerce.number().min(1),
      categoryId: z.string().min(1),
      colorId: z.string().min(1),
      sizeId: z.string().min(1),
      isFeatured: z.boolean().default(false).optional(),
      isArchived: z.boolean().default(false).optional(),
    })
  )
  .handler(async ({ input }) => {
    const user = await getUser();
    if (!user) {
      throw new ZSAError("NOT_AUTHORIZED", "User not authenticated");
    }
    const store = await prisma.store.findFirst({
      where: {
        userId: user.id, // vérifier que le store appartient bien à l'user connecté
      },
    });
    if (!store) {
      throw new ZSAError("NOT_FOUND", "Store not found or not owned by user");
    }
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        storeId: store.id,
      },
    });
    if (!category) {
      throw new ZSAError("NOT_FOUND", "Category not found");
    }

    const color = await prisma.color.findFirst({
      where: {
        id: input.colorId,
        storeId: store.id,
      },
    });
    if (!color) {
      throw new ZSAError("NOT_FOUND", "Color not found");
    }

    const size = await prisma.size.findFirst({
      where: {
        id: input.sizeId,
        storeId: store.id,
      },
    });
    if (!size) {
      throw new ZSAError("NOT_FOUND", "Size not found");
    }

    const product = await prisma.product.create({
      data: {
        name: input.name,
        images: {
          createMany: {
            data: input.images.map((image) => ({
              url: image.url,
            })),
          },
        },
        price: input.price,
        categoryId: input.categoryId,
        colorId: input.colorId,
        sizeId: input.sizeId,
        isFeatured: input.isFeatured,
        isArchived: input.isArchived,
        storeId: store.id,
      },
    });

    return [product];
  });

export const updateProductAction = action
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      images: z.object({ url: z.string() }).array(),
      price: z.coerce.number().min(1),
      categoryId: z.string().min(1),
      colorId: z.string().min(1),
      sizeId: z.string().min(1),
      isFeatured: z.boolean().default(false).optional(),
      isArchived: z.boolean().default(false).optional(),
    })
  )
  .handler(async ({ input }) => {
    const user = await getUser();
    if (!user) {
      throw new ZSAError("NOT_AUTHORIZED", "User not authenticated");
    }
    const store = await prisma.store.findFirst({
      where: {
        userId: user.id, // vérifier que le store appartient bien à l'user connecté
      },
    });
    if (!store) {
      throw new ZSAError("NOT_FOUND", "Store not found or not owned by user");
    }
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        storeId: store.id,
      },
    });
    if (!category) {
      throw new ZSAError("NOT_FOUND", "Category not found");
    }

    const color = await prisma.color.findFirst({
      where: {
        id: input.colorId,
        storeId: store.id,
      },
    });
    if (!color) {
      throw new ZSAError("NOT_FOUND", "Color not found");
    }

    const size = await prisma.size.findFirst({
      where: {
        id: input.sizeId,
        storeId: store.id,
      },
    });
    if (!size) {
      throw new ZSAError("NOT_FOUND", "Size not found");
    }
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      throw new ZSAError("NOT_FOUND", "Product not found");
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        price: input.price,
        categoryId: input.categoryId,
        colorId: input.colorId,
        sizeId: input.sizeId,
        isFeatured: input.isFeatured,
        isArchived: input.isArchived,
        images: {
          deleteMany: {},
          createMany: {
            data: input.images.map((image) => ({
              url: image.url,
            })),
          },
        },
      },
    });

    return [updatedProduct];
  }); // updateProductAction

export const deleteProductAction = action
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const user = await getUser();
    if (!user) {
      throw new ZSAError("NOT_AUTHORIZED", "User not authenticated");
    }
    const store = await prisma.store.findFirst({
      where: {
        userId: user.id, // vérifier que le store appartient bien à l'user connecté
      },
    });
    if (!store) {
      throw new ZSAError("NOT_FOUND", "Store not found or not owned by user");
    }
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      throw new ZSAError("NOT_FOUND", "Product not found");
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: input.id,
      },
    });
    return [deletedProduct];
  }); // deleteProductAction
