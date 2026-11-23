import Footer from "@/components/store/layout/footer";
import Navbar from "@/components/store/layout/navbar";
import StoreModalProvider from "@/providers/modal-store-provider";
import { demoStore } from "@/lib/demo-data";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = demoStore.getHomeCategories().map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    billboard: {
      id: c.id,
      label: c.billboardLabel,
      imageUrl: c.imageUrl,
    },
  }));

  return (
    <>
      <StoreModalProvider />
      <Navbar categories={categories} />
      {children}
      <Footer />
    </>
  );
}
