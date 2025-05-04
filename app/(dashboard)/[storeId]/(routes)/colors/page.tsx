import { format } from "date-fns/format";
import { ColorsColumn } from "./_components/columns";
import { prisma } from "@/lib/prisma";
import ColorsClient from "./_components/color-client";

export default async function ColorsPage(props: {
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;

  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
}
