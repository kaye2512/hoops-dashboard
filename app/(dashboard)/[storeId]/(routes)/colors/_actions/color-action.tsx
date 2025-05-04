"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { ZSAError } from "zsa";

export const createColorAction = action
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

    const size = await prisma.color.create({
      data: {
        name: input.name,
        value: input.value,
        storeId: store.id,
      },
    });

    return [size];
  }); //createSizeAction

export const updateColorAction = action
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

    const existingColor = await prisma.color.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingColor) {
      throw new ZSAError("NOT_FOUND", "Color does not exist");
    }

    const updatedColor = await prisma.color.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        value: input.value,
      },
    });

    return [updatedColor];
  }); //updateSizeAction

export const deleteColorAction = action
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

    const existingColor = await prisma.color.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!existingColor) {
      throw new ZSAError("NOT_FOUND", "Size Does not exist");
    }

    const deletedColor = await prisma.color.delete({
      where: {
        id: input.id,
      },
    });

    return [deletedColor];
  }); //deleteSizeAction
