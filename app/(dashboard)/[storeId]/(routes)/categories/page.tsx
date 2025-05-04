import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import CategoryClient from "./_components/category-client";
import { CategoryColumn } from "./_components/columns";

export default async function CategoriesPage(props: {
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
