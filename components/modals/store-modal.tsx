"use client";

import * as z from "zod";
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createStoreAction } from "@/actions/store-action";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { Loader2 } from "lucide-react";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
});

export default function StoreModal() {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { isPending, execute } = useServerAction(createStoreAction, {
    onSuccess: () => {
      toast.success("Store created successfully");
      router.refresh();
      storeModal.onClose();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeSchema>) => {
    try {
      setLoading(true);
      await execute(values);
      form.reset();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="E-commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  {isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Create store"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
