import { Product, Image } from "@prisma/client";

export type ProductWithNumberPrice = Omit<Product, "price"> & {
  price: number;
  images: Image[];
};
