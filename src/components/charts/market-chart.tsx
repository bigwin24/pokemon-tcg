"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: { label: string; value: number }[];
}

const COLORS = [
  "#94a3b8",
  "#94a3b8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#f59e0b",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-muted-foreground">{payload[0].payload.label}</p>
      <p className="font-bold text-primary">
        평균 ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export function MarketChart({ data }: Props) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, bottom: 20, left: 0 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#888" }}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#888" }}
            tickFormatter={(v) => `$${v}`}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
