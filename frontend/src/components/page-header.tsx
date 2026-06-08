import { Button, Card } from "@/components/ui";

export function PageHeader({ title, description, actionLabel, secondaryLabel }: { title: string; description: string; actionLabel?: string; secondaryLabel?: string }) {
  return (
    <Card className="mb-6 border-white/10 bg-white/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">CareerOS</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
        </div>
        {(actionLabel || secondaryLabel) && (
          <div className="flex flex-wrap gap-3">
            {secondaryLabel && <Button className="bg-white/10 text-slate-100 hover:bg-white/15">{secondaryLabel}</Button>}
            {actionLabel && <Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">{actionLabel}</Button>}
          </div>
        )}
      </div>
    </Card>
  );
}
