"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { ModuleCard } from "@/components/module-card";
import { Badge, Button, Card, Select } from "@/components/ui";
import {
  getApplications,
  deleteApplication,
  updateApplication,
  seedIfEmpty,
  APPLICATION_STAGES,
  getStageInfo,
  type Application,
  type ApplicationStatus,
} from "@/lib/store";

const filterTabs = [
  { value: "ALL", label: "All" },
  { value: "APPLIED", label: "Applied" },
  { value: "OA_SCHEDULED", label: "OA" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview" },
  { value: "OFFER_RECEIVED", label: "Offers" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);

  function reload() {
    setApps(getApplications());
  }

  useEffect(() => {
    seedIfEmpty();
    reload();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;
  }

  const filtered = filter === "ALL" ? apps : apps.filter((a) => a.status === filter);
  const totalApps = apps.length;
  const pending = apps.filter((a) => !["REJECTED", "WITHDRAWN", "ACCEPTED", "OFFER_RECEIVED"].includes(a.status)).length;
  const offers = apps.filter((a) => a.status === "OFFER_RECEIVED" || a.status === "ACCEPTED").length;
  const rejected = apps.filter((a) => a.status === "REJECTED").length;

  function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    updateApplication(id, { status: newStatus });
    reload();
    toast.success("Status updated");
  }

  function handleDelete(id: string) {
    deleteApplication(id);
    reload();
    toast.success("Application removed");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track every company you applied to. Change statuses, filter, and manage your placement pipeline."
        actionLabel="New application"
        actionHref="/applications/new"
      />

      <section className="grid gap-4 md:grid-cols-4">
        <ModuleCard title="Total" value={String(totalApps)} caption="All tracked applications" />
        <ModuleCard title="In Pipeline" value={String(pending)} caption="Awaiting next step" />
        <ModuleCard title="Offers" value={String(offers)} caption={offers > 0 ? "🎉 Selected!" : "Keep applying"} />
        <ModuleCard title="Rejected" value={String(rejected)} caption="Closed responses" />
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-white/5 p-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === tab.value
                ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-300/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {tab.label}
            {tab.value !== "ALL" && (
              <span className="ml-2 text-xs text-slate-500">
                {apps.filter((a) => a.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed border-white/10 bg-white/5 text-center py-12">
          <p className="text-lg font-semibold text-white">No applications found</p>
          <p className="mt-2 text-sm text-slate-400">{filter !== "ALL" ? "Try a different filter or " : ""}Start by adding your first application.</p>
          <Link href="/applications/new" className="mt-4 inline-block">
            <Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">
              <Plus className="mr-2 h-4 w-4" /> Add application
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const stage = getStageInfo(app.status);
            return (
              <Card key={app.id} className="border-white/10 bg-white/5 hover:border-cyan-400/20 transition">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link href={`/applications/${app.id}`} className="text-lg font-semibold text-white hover:text-cyan-200 transition">
                        {app.companyName}
                      </Link>
                      <Badge className={`border ${stage.color}`}>{stage.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{app.jobRole}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      {app.packageCtc && <span>💰 {app.packageCtc}</span>}
                      {app.location && <span>📍 {app.location}</span>}
                      {app.applicationDate && <span>📅 {format(new Date(app.applicationDate), "MMM d, yyyy")}</span>}
                      {app.source && <span>🔗 {app.source}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="w-48 text-xs py-2"
                    >
                      {APPLICATION_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </Select>
                    <Link href={`/applications/${app.id}`}>
                      <Button className="bg-white/10 text-slate-100 hover:bg-white/15 p-2">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button onClick={() => handleDelete(app.id)} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 p-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
