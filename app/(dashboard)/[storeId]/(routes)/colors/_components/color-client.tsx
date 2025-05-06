"use client";
import DataTable from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ColorsColumn, columns } from "./columns";

interface ColorsClientProps {
  data: ColorsColumn[];
}

export default function ColorsClient(props: ColorsClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Colors (${props.data.length})`}
          description={"Manage colors for your store"}
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className={"mr-2 h-4 w-4"} />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={props.data} />
    </>
  );
}
