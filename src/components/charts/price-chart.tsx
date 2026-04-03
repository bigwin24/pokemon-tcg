"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PriceHistory } from "@/types/cards/card";

interface Props {
  data: PriceHistory[];
  cardName: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-bold text-primary">${payload[0].value.toFixed(2)}</p>
      <p className="text-xs text-muted-foreground">
        저가 ${payload[1]?.value?.toFixed(2)} · 고가 $
        {payload[2]?.value?.toFixed(2)}
      </p>
    </div>
  );
}

export function PriceChart({ data, cardName }: Props) {
  const latest = data[data.length - 1];
  const oldest = data[0];
  const change = latest.market - oldest.market;
  const changePct = ((change / oldest.market) * 100).toFixed(1);
  const isUp = change >= 0;

  return (
    <div className="space-y-3">
      {/* 현재가 + 변동률 */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold">${latest.market.toFixed(2)}</span>
        <span
          className={`text-sm font-medium mb-1 ${isUp ? "text-green-500" : "text-red-500"}`}
        >
          {isUp ? "▲" : "▼"} {Math.abs(Number(changePct))}% (30일)
        </span>
      </div>

      {/* 차트 */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#888" }}
              tickFormatter={(v) => v.slice(5)} // MM-DD만 표시
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#888" }}
              tickFormatter={(v) => `$${v}`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="market"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="transparent"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="transparent"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
