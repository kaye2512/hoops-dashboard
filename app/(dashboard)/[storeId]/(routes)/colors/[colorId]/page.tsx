import { prisma } from "@/lib/prisma";
import ColorForm from "./_components/color-form";

export default async function ColorPage(props: {
  params: Promise<{ colorId: string }>;
}) {
  const params = await props.params;

  const color = await prisma.color.findFirst({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}
