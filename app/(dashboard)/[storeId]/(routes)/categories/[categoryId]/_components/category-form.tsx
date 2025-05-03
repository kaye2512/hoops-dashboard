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
import { Billboard, Category } from "@prisma/client";
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
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "../_actions/category-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export default function CategoryForm({
  initialData,
  billboards,
}: CategoryFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit category" : "Add a new category";
  const toastMessage = initialData ? "category updated" : "category created";
  const action = initialData ? "Save changes" : "Create";

  const { isPending: isCreatePending, mutate: createMutate } =
    useServerActionMutation(createCategoryAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isUpdatePending, mutate: updateMutate } =
    useServerActionMutation(updateCategoryAction, {
      onSuccess: () => {
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const { isPending: isDeletePending, mutate: deleteMutate } =
    useServerActionMutation(deleteCategoryAction, {
      onSuccess: () => {
        toast.success("Category deleted");
        router.refresh();
        router.push(`/${params.storeId}/categories`);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    if (initialData) {
      await updateMutate({
        id: initialData.id,
        name: values.name,
        billboardId: values.billboardId,
      });
    } else {
      await createMutate({
        name: values.name,
        billboardId: values.billboardId,
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
                      placeholder={"Category name"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"billboardId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder={"Select a billboard"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
