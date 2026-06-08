import { Card } from "@/components/ui";

export function ModuleCard({ title, value, caption, tone }: { title: string; value: string; caption: string; tone?: string }) {
  return (
    <Card className={`border-white/10 ${tone ?? "bg-white/5"}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{caption}</p>
    </Card>
  );
}
