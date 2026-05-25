import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { TableCard } from "@/components/table-card";
import { ModuleCard } from "@/components/module-card";
import { applicationList } from "@/lib/app-data";
import { Button } from "@/components/ui";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track every company application manually, with status, date, package, and location in one place."
        actionLabel="New application"
        secondaryLabel="Filter applications"
      />

      <section className="grid gap-4 md:grid-cols-4">
        <ModuleCard title="Total" value="128" caption="All tracked applications" />
        <ModuleCard title="Pending" value="34" caption="Awaiting next step" />
        <ModuleCard title="Selected" value="6" caption="Offers or final selections" />
        <ModuleCard title="Rejected" value="19" caption="Closed responses" />
      </section>

      <div className="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
        <Button className="bg-white/10 text-slate-100 hover:bg-white/15">All</Button>
        <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Applied</Button>
        <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Interview</Button>
        <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Offer</Button>
        <Button className="bg-white/10 text-slate-100 hover:bg-white/15">Rejected</Button>
      </div>

      <TableCard
        title="Application tracker"
        columns={["Company", "Role", "CTC", "Status", "Date", "Location"]}
        rows={applicationList.map((item) => [item.company, item.role, item.ctc, item.status, item.date, item.location])}
      />

      <div className="flex justify-end">
        <Link href="/applications/new" className="text-sm text-cyan-300 underline-offset-4 hover:underline">Create a new application record</Link>
      </div>
    </div>
  );
}
