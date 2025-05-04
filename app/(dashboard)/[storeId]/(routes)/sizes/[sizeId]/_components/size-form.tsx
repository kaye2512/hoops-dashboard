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
import { Size } from "@prisma/client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useServerActionMutation } from "@/lib/zod-server-action/zsa-query";
import {
  createSizeAction,
  deleteSizeAction,
  updateSizeAction,
} from "../../_actions/size-action";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizesFormValues = z.infer<typeof formSchema>;

interface SizesFormProps {
  initialData: Size | null;
}

export default function SizeForm({ initialData }: SizesFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit size" : "Add a new size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes" : "Create";

  const { isPending: isCreatePending, mutate: createMutate } =
    useServerActionMutation(createSizeAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isUpdatePending, mutate: updateMutate } =
    useServerActionMutation(updateSizeAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isDeletePending, mutate: deleteMutate } =
    useServerActionMutation(deleteSizeAction, {
      onSuccess: () => {
        toast.success("Size deleted");
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: SizesFormValues) => {
    if (initialData) {
      await updateMutate({
        id: initialData.id,
        name: values.value,
        value: values.value,
      });
    } else {
      await createMutate({
        name: values.name,
        value: values.value,
      });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteMutate({ id: initialData?.id || "" })}
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
          <div className={"grid grid-cols-3 gap-8"}>
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder={"Size Name"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"value"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder={"Size value"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className={"ml-auto"} type={"submit"}>
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
