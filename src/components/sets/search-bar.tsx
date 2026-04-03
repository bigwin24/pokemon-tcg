"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 300ms 디바운스
    const timeout = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams();
        if (newValue) params.set("q", newValue);
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(timeout);
  };

  return (
    <div className="relative max-w-md">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Search size={16} />
        )}
      </div>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Base, XY, Perfect Order..."
        className="pl-9"
      />
    </div>
  );
}
