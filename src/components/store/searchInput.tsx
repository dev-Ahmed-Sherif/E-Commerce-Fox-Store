"use client";

import { useState, ChangeEventHandler, useEffect } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Input } from "@/components/ui/input";

import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");

  const debounceValue = useDebounceValue<string>(value);

  useEffect(() => {
    const query = {
      name: debounceValue,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [value, router, debounceValue]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/") return null;

  return (
    <div className="relative sm:block hidden">
      <Search
        className="absolute h-6 w-6 top-2 left-4 text-muted-foreground"
        color="#ee1717"
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder="أنت بتدور على ايه"
        className="pl-14 h-10 bg-primary/10 font-bold md:text-lg"
      />
    </div>
  );
};

export default SearchInput;
