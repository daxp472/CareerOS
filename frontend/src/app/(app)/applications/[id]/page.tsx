import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { applicationList } from "@/lib/app-data";

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = applicationList.find((item) => String(item.id) === params.id);
  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`${application.company} · ${application.role}`} description="Detailed placement record with notes, reminders, and interview progression." actionLabel="Edit application" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Application details</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-300">
            <div>Company: <span className="text-white">{application.company}</span></div>
            <div>Role: <span className="text-white">{application.role}</span></div>
            <div>CTC: <span className="text-white">{application.ctc}</span></div>
            <div>Status: <span className="text-white">{application.status}</span></div>
            <div>Date: <span className="text-white">{application.date}</span></div>
            <div>Location: <span className="text-white">{application.location}</span></div>
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Next actions</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Add or update interview records</li>
            <li>• Link the correct resume version</li>
            <li>• Schedule a reminder for the next deadline</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
