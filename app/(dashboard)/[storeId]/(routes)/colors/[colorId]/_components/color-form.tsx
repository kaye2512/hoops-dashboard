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
import { Color } from "@prisma/client";
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
  createColorAction,
  deleteColorAction,
  updateColorAction,
} from "../../_actions/color-action";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type ColorsFormValues = z.infer<typeof formSchema>;

interface ColorsFormProps {
  initialData: Color | null;
}

export default function ColorForm({ initialData }: ColorsFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit color" : "Add a new color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes" : "Create";

  const { isPending: isCreatePending, mutate: createMutate } =
    useServerActionMutation(createColorAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/colors`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isUpdatePending, mutate: updateMutate } =
    useServerActionMutation(updateColorAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/colors`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isDeletePending, mutate: deleteMutate } =
    useServerActionMutation(deleteColorAction, {
      onSuccess: () => {
        toast.success("Color deleted");
        router.refresh();
        router.push(`/${params.storeId}/colors`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  const form = useForm<ColorsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: ColorsFormValues) => {
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
                      placeholder={"Color Name"}
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className={"flex items-center gap-x-4"}>
                      <Input
                        disabled={isPending}
                        placeholder={"Color value"}
                        {...field}
                      />
                      <div
                        className={"border p-4 rounded-full"}
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
