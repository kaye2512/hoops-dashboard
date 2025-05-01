import Navbar from "@/components/navbars/navbar";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;
  // verify if user is connected
  const user = await getUser();
  // if not redirige vers le login
  if (!user) {
    redirect("/auth/signin");
  }
  // verifie si l'utilisateur a une store
  const store = await prisma.store.findFirst({
    where: {
      userId: user.id,
      id: params.storeId,
    },
  });
  // if not store redirige vers l'acceuil de création de store le modal
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
}
