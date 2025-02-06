import Link from "next/link";
import Image from "next/image";

import getCategories from "@/actions/get-categories";

import Container from "@/components/ui/container";
import MainNav from "@/components/store/layout/main-nav";
import NavbarActions from "@/components/store/layout/navbar-actions";
import SearchInput from "@/components/store/searchInput";

// Revalidate the data every 10 minutes which disable caching
export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <header className="top-0 z-50 sticky border-b py-4">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <Image src="/logo.jpg" alt="logo" width={150} height={150} />
          </Link>
          <SearchInput />
          <NavbarActions />
        </div>
      </Container>
      <MainNav data={categories} />
    </header>
  );
};

export default Navbar;
