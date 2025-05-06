"use client";
import { ColumnDef } from "@tanstack/react-table";

export type OrdersColumn = {
  id: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "street",
    header: "Street",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "postalCode",
    header: "Postal code",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
