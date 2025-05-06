"use client";
import DataTable from "@/components/tables/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrdersColumn, columns } from "./columns";

interface OrdersClientProps {
  data: OrdersColumn[];
}

export default function OrdersClient(props: OrdersClientProps) {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading
          title={`Orders (${props.data.length})`}
          description={"Manage orders for your store"}
        />
      </div>
      <Separator />
      <DataTable searchKey={"products"} columns={columns} data={props.data} />
    </>
  );
}
