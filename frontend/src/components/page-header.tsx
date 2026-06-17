import Link from "next/link";
import { Button, Card } from "@/components/ui";

export function PageHeader({ title, description, actionLabel, actionHref, secondaryLabel, secondaryHref, onAction, onSecondary }: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onAction?: () => void;
  onSecondary?: () => void;
}) {
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
            {secondaryLabel && secondaryHref ? (
              <Link href={secondaryHref}><Button className="bg-white/10 text-slate-100 hover:bg-white/15">{secondaryLabel}</Button></Link>
            ) : secondaryLabel && onSecondary ? (
              <Button onClick={onSecondary} className="bg-white/10 text-slate-100 hover:bg-white/15">{secondaryLabel}</Button>
            ) : secondaryLabel ? (
              <Button className="bg-white/10 text-slate-100 hover:bg-white/15">{secondaryLabel}</Button>
            ) : null}
            {actionLabel && actionHref ? (
              <Link href={actionHref}><Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">{actionLabel}</Button></Link>
            ) : actionLabel && onAction ? (
              <Button onClick={onAction} className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">{actionLabel}</Button>
            ) : actionLabel ? (
              <Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">{actionLabel}</Button>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
