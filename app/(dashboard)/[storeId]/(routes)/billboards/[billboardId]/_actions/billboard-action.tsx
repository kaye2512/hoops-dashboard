"use server";

import { prisma } from "@/lib/prisma";
import { authedAction } from "@/lib/zod-server-action/zsa";
import { z } from "zod";

export const createBillboardAction = authedAction
  .input(
    z.object({
      label: z.string().min(1),
      imageUrl: z.string().min(1),
    })
  )
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const storeByUserId = await prisma.store.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!storeByUserId) {
      throw new Error("Store not found");
    }
    const billboard = await prisma.billboard.create({
      data: {
        label: input.label,
        imageUrl: input.imageUrl,
        storeId: storeByUserId.id,
      },
    });
    return [billboard, null];
  }); // createBillboardAction
