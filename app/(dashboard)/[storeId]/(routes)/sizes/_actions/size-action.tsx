"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { ZSAError } from "zsa";

export const createSizeAction = action
  .input(
    z.object({
      name: z.string().min(1),
      value: z.string().min(1),
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

    const size = await prisma.size.create({
      data: {
        name: input.name,
        value: input.value,
        storeId: store.id,
      },
    });

    return [size];
  }); //createSizeAction

export const updateSizeAction = action
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      value: z.string().min(1),
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

    const existingSize = await prisma.size.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingSize) {
      throw new ZSAError("NOT_FOUND", "Sizes does not exist");
    }

    const updatedSize = await prisma.size.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        value: input.value,
      },
    });

    return [updatedSize];
  }); //updateSizeAction

export const deleteSizeAction = action
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

    const existingSize = await prisma.size.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingSize) {
      throw new ZSAError("NOT_FOUND", "Size Does not exist");
    }

    const deletedSize = await prisma.size.delete({
      where: {
        id: input.id,
      },
    });

    return [deletedSize];
  }); //deleteSizeAction
