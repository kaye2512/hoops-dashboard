"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";
import { useServerActionMutation } from "@/lib/zod-server-action/zsa-query";
import { SizesColumn } from "./columns";
import { deleteSizeAction } from "../_actions/size-action";

interface CellActionProps {
  data: SizesColumn;
}

export default function CellAction(props: CellActionProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onDelete = useServerActionMutation(deleteSizeAction, {
    onSuccess: () => {
      toast.success("Sizes deleted");
      router.refresh(); // refresh the data
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete.mutate({ id: props.data.id || "" })}
        loading={onDelete.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className={"h-8 w-8 p-0"}>
            <span className={"sr-only"}>Open menu</span>
            <MoreHorizontal className={"h-4 w-4"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"end"}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/sizes/${props.data.id}`)
            }
          >
            <Edit className={"mr-2 h-4 w-4"} />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className={"mr-2 h-4 w-4"} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
