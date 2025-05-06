import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/settings-form";

export default async function SettingsPage(props: {
  params: { storeId: string };
}) {
  const params = await props.params;
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
