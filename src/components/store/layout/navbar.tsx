import Link from "next/link";

import getCategories from "@/actions/get-categories";

import Container from "@/components/ui/container";
import MainNav from "@/components/store/layout/main-nav";
import NavbarActions from "./navbar-actions";

// Revalidate the data every 10 minutes which disable caching
export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <header className="border-b">
      <Container>
        <nav className="border-b relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/store" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl"> فوكس ستور </p>
          </Link>
          <NavbarActions />
        </nav>
        <MainNav data={categories} />
      </Container>
    </header>
  );
};

export default Navbar;
