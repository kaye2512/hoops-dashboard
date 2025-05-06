"use client";
import DataTable from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

import { SizesColumn, columns } from "./columns";

interface SizesClientProps {
  data: SizesColumn[];
}

export default function SizesClient(props: SizesClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Sizes (${props.data.length})`}
          description={"Manage Size for your store"}
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className={"mr-2 h-4 w-4"} />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={props.data} />
    </>
  );
}
