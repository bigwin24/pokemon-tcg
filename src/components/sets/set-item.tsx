"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Set } from "@/types/sets/set";
import { cn } from "@/lib/utils";

interface Props {
  set: Set;
}

// 레어리티별 테두리 색상
const rarityBorder: Record<string, string> = {
  Common: "border-gray-300",
  Uncommon: "border-green-400",
  Rare: "border-blue-400",
  "Rare Holo": "border-purple-400",
  "Rare Ultra": "border-yellow-400",
  "Rare Secret": "border-yellow-500 shadow-yellow-400/50 shadow-md",
  "Amazing Rare": "border-pink-400",
  "Rare Rainbow": "border-pink-500 shadow-pink-400/50 shadow-md",
  "Rare Holo VMAX": "border-red-400 shadow-red-400/30 shadow-md",
  "Rare Holo V": "border-orange-400",
};

export function SetItem({ set }: Props) {
  return (
    <Link href={`/sets/${set.id}`}>
      <div
        className={cn(
          "group relative bg-card rounded-xl border-2 overflow-hidden",
          "hover:scale-105 transition-transform duration-200 cursor-pointer",
        )}
      >
        {/* 카드 이미지 */}
        <div className="relative aspect-[2.5/3.5] bg-muted">
          <Image
            src={set.images.logo}
            alt={set.name}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        </div>

        {/* 확장팩 정보 */}
        <div className="p-2.5 space-y-1.5">
          <p className="text-sm font-semibold truncate">{set.name}</p>
        </div>
      </div>
    </Link>
  );
}
