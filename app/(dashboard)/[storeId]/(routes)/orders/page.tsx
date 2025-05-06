import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { OrdersColumn } from "./_components/columns";
import OrdersClient from "./_components/order-client";
import { formater } from "@/lib/utils";

export default async function BillboardsPage(props: {
  params: Promise<{ storeId: string }>;
}) {
  const params = await props.params;

  const orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrdersColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    street: item.street,
    city: item.city,
    postalCode: item.postalCode,
    country: item.country,
    isPaid: item.isPaid,
    totalPrice: formater.format(
      item.orderItems.reduce((total, item) => {
        return (total = Number(item.product.price));
      }, 0)
    ),
    products: item.orderItems.map((item) => item.product.name).join(", "),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
}
