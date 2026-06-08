"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui";

const gradientStops = ["#22d3ee", "#38bdf8", "#60a5fa"];

export function OverviewCharts({ data }: { data: Array<{ month: string; applications: number; offers: number; rejections: number }> }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Growth</p>
            <h3 className="text-xl font-semibold text-white">Applications per month</h3>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">+32% MoM</span>
        </div>
        <div className="h-72 min-w-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="applicationsFill" x1="0" y1="0" x2="0" y2="1">
                    {gradientStops.map((color, index) => (
                      <stop key={color} offset={`${index * 45}%`} stopColor={color} stopOpacity={index === 0 ? 0.42 : 0.1} />
                    ))}
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(226,232,240,0.6)" />
                <YAxis stroke="rgba(226,232,240,0.6)" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="applications" stroke="#22d3ee" fill="url(#applicationsFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-400">Loading chart...</div>
          )}
        </div>
      </Card>

      <Card className="min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70">Outcome mix</p>
            <h3 className="text-xl font-semibold text-white">Offer vs rejection ratio</h3>
          </div>
          <span className="rounded-full bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-200">Success rate 18.7%</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="h-72 min-w-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="rgba(226,232,240,0.6)" />
                  <YAxis stroke="rgba(226,232,240,0.6)" />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, color: "#e2e8f0" }} />
                  <Bar dataKey="offers" fill="#34d399" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="rejections" fill="#fb7185" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-400">Loading chart...</div>
            )}
          </div>
          <div className="flex min-w-0 items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[{ name: "Selected", value: 28 }, { name: "Rejected", value: 72 }]} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={3}>
                    <Cell fill="#22d3ee" />
                    <Cell fill="#fb7185" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-400">Loading chart...</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
