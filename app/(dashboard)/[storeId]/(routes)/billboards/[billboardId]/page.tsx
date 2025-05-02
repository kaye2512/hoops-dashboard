import { prisma } from "@/lib/prisma";
import BillboardForm from "./_components/billboard-form";

export default async function BillboardsPage(props: {
  params: Promise<{ billboardId: string }>;
}) {
  const params = await props.params;
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
