import { createServerAction, createServerActionProcedure, ZSAError } from "zsa";
import { getUser } from "../auth-session";

const authedProcedure = createServerActionProcedure().handler(async () => {
  try {
    const user = await getUser();
    if (!user) {
      throw new ZSAError("NOT_AUTHORIZED", "User not found");
    }
    return { user: { id: user.id, email: user.email } };
  } catch {
    throw new ZSAError("NOT_AUTHORIZED", "User not found");
  }
});

export const authedAction = authedProcedure.createServerAction();

export const action = createServerAction();
