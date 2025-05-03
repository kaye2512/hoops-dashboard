"use client";

import * as z from "zod";
import AlertModal from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
/* import { useServerAction } from "zsa-react"; */
import {
  createBillboardAction,
  deleteBillboardAction,
  updateBillboardAction,
} from "../_actions/billboardId-action";
import ImageUpload from "@/components/ui/image-upload";
import { useServerActionMutation } from "@/lib/zod-server-action/zsa-query";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});
type BillboardsFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export default function BillboardForm({ initialData }: BillboardFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billoard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const { isPending: isCreatePending, mutate: createMutate } =
    useServerActionMutation(createBillboardAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isUpdatePending, mutate: updateMutate } =
    useServerActionMutation(updateBillboardAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const isPending = isCreatePending || isUpdatePending;

  const form = useForm<BillboardsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: BillboardsFormValues) => {
    if (initialData) {
      await updateMutate({ id: initialData.id, ...values });
    } else {
      await createMutate(values);
    }
  };

  const onDelete = useServerActionMutation(deleteBillboardAction, {
    onSuccess: () => {
      toast.success("Billboard deleted");
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
        onConfirm={() => onDelete.mutate({ id: initialData?.id || "" })}
        loading={isPending}
      />
      <div className={"flex items-center justify-between"}>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            <Trash className={"h-4 w-4"} />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"space-y-8 w-full"}
        >
          <FormField
            control={form.control}
            name={"imageUrl"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={"grid grid-cols-3 gap-8"}>
            <FormField
              control={form.control}
              name={"label"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder={"Billboard label"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} type="submit" className={"ml-auto"}>
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <div>{action}</div>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
