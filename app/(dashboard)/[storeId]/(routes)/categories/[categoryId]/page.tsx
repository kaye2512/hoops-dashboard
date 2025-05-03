import { prisma } from "@/lib/prisma";
import CategoryForm from "./_components/category-form";

export default async function CategoriesPage(props: {
  params: Promise<{ categoryId: string; storeId: string }>;
}) {
  const params = await props.params;
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}
