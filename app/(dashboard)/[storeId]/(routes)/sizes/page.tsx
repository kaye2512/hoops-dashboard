import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { SizesColumn } from "./_components/columns";
import SizesClient from "./_components/size-client";

export default async function SizesPage(props: {
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
}
