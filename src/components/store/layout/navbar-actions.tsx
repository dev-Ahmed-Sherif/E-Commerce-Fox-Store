"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import useToggleState from "@/hooks/use-toggle-state";
import { useEffect } from "react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

import ModeToggle from "@/components/mode-toggle";

const NavbarActions = () => {
  // const [isMounted, toggleIsMounted] = useToggleState();

  // useEffect(() => {
  //   toggleIsMounted();
  // }, []);

  // if (!isMounted) return null;

  const cart = useCart();

  const router = useRouter();

  return (
    <div className="flex items-center gap-x-4">
      <Button
        onClick={() => router.push("/store/cart")}
        className="flex items-center rounded-full font-bold text-lg bg-black dark:bg-white px-4 py-2"
      >
        <ShoppingCart size={140} className="dark:text-black font-bold" />
        <span className="ml-2 font-medium">{cart.items.length}</span>
      </Button>
      <ModeToggle />
    </div>
  );
};

export default NavbarActions;
