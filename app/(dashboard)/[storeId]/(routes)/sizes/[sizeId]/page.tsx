import { prisma } from "@/lib/prisma";
import SizeForm from "./_components/size-form";

export default async function SizePage(props: {
  params: Promise<{ sizeId: string }>;
}) {
  const params = await props.params;

  const size = await prisma.size.findFirst({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}
