import CategoryView from "@/components/store/category-view";
import { demoStore } from "@/lib/demo-data";

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = demoStore.getCategory(params.categoryId) || null;
  const products = demoStore
    .getProducts()
    .filter((p) => p.categoryId === params.categoryId && !p.isArchived);

  return <CategoryView category={category} products={products} />;
}
