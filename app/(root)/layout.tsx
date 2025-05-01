import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // redirect to a sign-in if user is not connected
  if (!user) {
    redirect("/auth/signin");
  }

  // check if user as a store
  const store = await prisma.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  // redirection vers la dashboard de l'user si il a deja crée un store
  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
