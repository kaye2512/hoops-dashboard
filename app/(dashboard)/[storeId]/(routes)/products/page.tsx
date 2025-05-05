import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ProductsColumn } from "./_components/columns";
import ProductsClient from "./_components/product-client";
import { formater } from "@/lib/utils";
import { ProductWithNumberPrice } from "./_types/product";

export default async function ProductsPage(props: {
  params: { storeId: string };
}) {
  const params = props.params;

  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert products to use number price
  const formattedProducts: ProductsColumn[] = products.map((item) => {
    const productWithNumberPrice: ProductWithNumberPrice = {
      ...item,
      price: Number(item.price),
      images: [],
    };

    return {
      id: productWithNumberPrice.id,
      name: productWithNumberPrice.name,
      isFeatured: productWithNumberPrice.isFeatured,
      isArchived: productWithNumberPrice.isArchived,
      price: formater.format(productWithNumberPrice.price),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
}
