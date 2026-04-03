"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/cards", label: "카드 검색", icon: Search },
  { href: "/sets", label: "확장팩 검색", icon: Search },
  { href: "/market", label: "시장 분석", icon: TrendingUp },
  { href: "/collection", label: "내 컬렉션", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r bg-card flex flex-col shrink-0">
      {/* 로고 */}
      <div className="p-5 border-b">
        <h1 className="text-lg font-bold tracking-tight">🃏 Pokemon Card</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          포켓몬 TCG 시세 분석
        </p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* 하단 */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Powered by Pokémon TCG API
        </p>
      </div>
    </aside>
  );
}
