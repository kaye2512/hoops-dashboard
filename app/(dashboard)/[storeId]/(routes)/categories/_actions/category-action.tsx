"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { ZSAError } from "zsa";

export const createCategoryAction = action
  .input(
    z.object({
      name: z.string().min(1),
      billboardId: z.string().min(1),
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
    const billboard = await prisma.billboard.findFirst({
      where: {
        id: input.billboardId,
        storeId: store.id,
      },
    });

    if (!billboard) {
      throw new ZSAError("NOT_FOUND", "Billboard not found");
    }

    const category = await prisma.category.create({
      data: {
        name: input.name,
        billboardId: billboard.id,
        storeId: store.id,
      },
    });

    return [category];
  });

export const updateCategoryAction = action
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      billboardId: z.string().min(1),
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
    const billboard = await prisma.billboard.findFirst({
      where: {
        id: input.billboardId,
        storeId: store.id,
      },
    });

    if (!billboard) {
      throw new ZSAError("NOT_FOUND", "Billboard not found");
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingCategory) {
      throw new ZSAError("NOT_FOUND", "Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        billboardId: billboard.id,
      },
    });

    return [updatedCategory];
  });

export const deleteCategoryAction = action
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
        userId: user.id,
      },
    });
    if (!store) {
      throw new ZSAError("NOT_FOUND", "Store not found or not owned by user");
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingCategory) {
      throw new ZSAError("NOT_FOUND", "Category not found");
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: input.id,
      },
    });

    return [deletedCategory];
  });
