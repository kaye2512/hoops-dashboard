import { prisma } from "@/lib/prisma";
import ProductForm from "./_components/product-form";
import { ProductWithNumberPrice } from "../_types/product";

export default async function ProductPage(props: {
  params: Promise<{ storeId: string; productId: string }>;
}) {
  const params = await props.params;

  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  // Convert Decimal price to number before passing to form
  const formattedProduct: ProductWithNumberPrice | null = product
    ? {
        ...product,
        price: Number(product.price),
      }
    : null;

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className={"flex-col"}>
      <div className={"flex-1 space-y-4 p-8 pt-6"}>
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={formattedProduct}
        />
      </div>
    </div>
  );
}
