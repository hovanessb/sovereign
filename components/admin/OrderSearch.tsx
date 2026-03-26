"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export function OrderSearch({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && initialQuery) {
      inputRef.current.value = initialQuery;
    }
  }, [initialQuery]);

  const handleChange = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.push(`/admin/orders${params.toString() ? `?${params}` : ""}`);
    }, 300);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={initialQuery ?? ""}
          placeholder="Search orders (ID, email, name)..."
          onChange={(e) => handleChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-ivory focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
    </div>
  );
}
