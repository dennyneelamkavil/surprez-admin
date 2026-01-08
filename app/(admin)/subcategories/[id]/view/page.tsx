import { Metadata } from "next";
import SubCategoryViewClient from "../../components/SubCategoryViewClient";

export const metadata: Metadata = {
  title: "View SubCategory | Surprez Admin",
  description: "View subcategory details in Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewSubCategoryPage({ params }: Params) {
  const { id } = await params;
  return <SubCategoryViewClient id={id} />;
}
