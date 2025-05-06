"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { ZSAError } from "zsa";

export const updateSettingsAction = action
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1),
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
    const existingStore = await prisma.store.findFirst({
      where: {
        id: input.id,
        userId: user.id,
      },
    });

    if (!existingStore) {
      throw new ZSAError("NOT_FOUND", "Store not found");
    }

    const updatedStore = await prisma.store.updateMany({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });

    return [updatedStore];
  }); // updateSettingsAction

export const deleteSettingsAction = action
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
    const existingStore = await prisma.store.findFirst({
      where: {
        id: input.id,
        userId: user.id,
      },
    });

    if (!existingStore) {
      throw new ZSAError("NOT_FOUND", "Store not found");
    }

    const deletedStore = await prisma.store.delete({
      where: {
        id: input.id,
      },
    });
    return [deletedStore];
  });
