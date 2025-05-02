"use client";
import DataTable from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export default function BillboardClient(props: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Billboards (${props.data.length})`}
          description={"Manage billboards for your store"}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className={"mr-2 h-4 w-4"} />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey={"label"} columns={columns} data={props.data} />
      <Heading title={"Api"} description={"Api calls for billBoard"} />
      <Separator />
    </>
  );
}
