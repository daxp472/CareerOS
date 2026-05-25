import { PageHeader } from "@/components/page-header";
import { Card, Input, Textarea, Button } from "@/components/ui";
import { interviewList } from "@/lib/app-data";

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Interviews" description="Track interview rounds, types, outcomes, and feedback notes for every company." actionLabel="Add interview" />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Interview timeline</h3>
          <div className="mt-4 space-y-3">
            {interviewList.map((item) => (
              <div key={`${item.company}-${item.round}`} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                <p className="font-medium text-white">{item.company} · {item.round}</p>
                <p className="mt-1">Type: {item.type} · Outcome: {item.outcome}</p>
                <p className="mt-1 text-slate-400">{item.date}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Add round</h3>
          <div className="mt-4 space-y-3">
            <Input placeholder="Company" />
            <Input placeholder="Round number" />
            <Input placeholder="Interview type" />
            <Input type="datetime-local" />
            <Textarea placeholder="Feedback notes" />
            <Button className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save interview</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
