"use client";

import AlertModal from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Store } from "@prisma/client";
import { useServerActionMutation } from "@/lib/zod-server-action/zsa-query";
import { toast } from "sonner";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import {
  deleteSettingsAction,
  updateSettingsAction,
} from "../_actions/settings-action";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Store" : "Create Store";
  const description = initialData ? "Edit Store" : "Add a new Store";
  const toastMessage = initialData ? "Store updated" : "Store created";
  const action = initialData ? "Save changes" : "Create";

  const { isPending: isUpdatePending, mutate: updateMutate } =
    useServerActionMutation(updateSettingsAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/settings`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const isPending = isUpdatePending;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    await updateMutate({ id: initialData.id, ...values });
  };

  const onDelete = useServerActionMutation(deleteSettingsAction, {
    onSuccess: () => {
      toast.success("Store deleted");
      router.refresh();
      router.push("/");
    },
    onError: () => {
      toast.error("Make sure you have deleted all the products");
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
                      placeholder={"Store name"}
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
      <Separator />
      <ApiAlert
        title={"NEXT_PUBLIC_API_URL"}
        description={`${origin}/api/${params.storeId}`}
        variant={"public"}
      />
    </>
  );
}
