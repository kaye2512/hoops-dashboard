"use server";

import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";
import { getUser } from "@/lib/auth-session";
import { ZSAError } from "zsa";

export const createBillboardAction = action
  .input(
    z.object({
      label: z.string().min(1),
      imageUrl: z.string().min(1),
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
    const billboard = await prisma.billboard.create({
      data: {
        label: input.label,
        imageUrl: input.imageUrl,
        storeId: store.id,
      },
    });

    return [billboard];
  }); // createBillboardAction

export const deleteBillboardAction = action
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
    const billboardId = await prisma.billboard.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!billboardId) {
      throw new ZSAError("NOT_FOUND", "Billboard not found");
    }

    const deletedBillboard = await prisma.billboard.deleteMany({
      where: {
        id: input.id,
      },
    });

    return [deletedBillboard];
  }); // deleteBillboardAction

export const updateBillboardAction = action
  .input(
    z.object({
      id: z.string(),
      label: z.string().min(1),
      imageUrl: z.string().min(1),
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
    const billboardId = await prisma.billboard.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
      },
    });

    if (!billboardId) {
      throw new ZSAError("NOT_FOUND", "Billboard not found");
    }

    const billboard = await prisma.billboard.update({
      where: {
        id: input.id,
      },
      data: {
        label: input.label,
        imageUrl: input.imageUrl,
      },
    });

    return [billboard];
  }); // updateBillboardAction
