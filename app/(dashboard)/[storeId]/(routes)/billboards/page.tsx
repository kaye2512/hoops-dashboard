import BillboardClient from "./_components/client";

export default async function BillboardsPage(props: {
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={""} />
      </div>
    </div>
  );
}
