import { Metadata } from "next";
import ProductFormClient from "../../components/ProductFormClient";

export const metadata: Metadata = {
  title: "Edit Product | Surprez Admin",
  description: "Edit product in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  return <ProductFormClient mode="edit" id={id} />;
}
