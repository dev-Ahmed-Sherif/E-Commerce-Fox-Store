"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ShoppingCart, Heart, CircleUserRound } from "lucide-react";

import useCart from "@/hooks/use-cart";

import ModeToggle from "@/components/mode-toggle";

const NavbarActions = () => {
  const router = useRouter();

  const cart = useCart();

  return (
    <div className="flex items-center gap-x-2">
      <div
        onClick={() => {}}
        className="cursor-pointer border-l-2 flex items-center gap-x-2 font-bold text-lg px-4 py-2"
      >
        <p> تسجيل الدخول </p>
        <CircleUserRound size={28} color="#ee1717" />
      </div>
      <Link
        href="/favorites"
        className="relative border-l-2 flex items-center gap-x-2 font-bold text-lg px-4 py-2"
      >
        <p> المفضلة </p>
        <Heart
          size={28}
          className="text-white dark:text-black font-bold"
          color="#ee1717"
        />
        {cart.items.length > 0 && (
          <span className="absolute w-5 h-5 flex items-center justify-center bg-green-500 rounded-full left-3 -top-[5px] font-medium">
            {cart.items.length}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        className="relative border-l-2 flex items-center gap-x-2 font-bold text-lg px-4 py-2"
      >
        <p> عربة التسوق </p>
        <ShoppingCart
          size={28}
          className="text-white dark:text-black font-bold"
          color="#ee1717"
        />
        {cart.items.length > 0 && (
          <span className="absolute w-5 h-5 flex items-center justify-center bg-green-500 rounded-full left-3 -top-[5px] font-medium">
            {cart.items.length}
          </span>
        )}
      </Link>
      <ModeToggle />
    </div>
  );
};

export default NavbarActions;
