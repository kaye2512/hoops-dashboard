"use server";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { action } from "@/lib/zod-server-action/zsa";
import { z } from "zod";

export const createStoreAction = action
  .input(
    z.object({
      name: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    const store = await prisma.store.create({
      data: {
        name: input.name,
        userId: user.id,
      },
    });
    return [store, null];
  });
