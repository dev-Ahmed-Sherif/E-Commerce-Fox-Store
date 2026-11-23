import StoreHome from "@/components/store/store-home";
import { demoStore } from "@/lib/demo-data";

export default function HomePage() {
  const categories = demoStore.getHomeCategories();
  const products = demoStore.getFeaturedProducts();

  return <StoreHome categories={categories} products={products} />;
}
