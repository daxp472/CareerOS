"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, CalendarCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import {
  getApplication,
  updateApplication,
  deleteApplication,
  getInterviews,
  addInterview,
  APPLICATION_STAGES,
  getStageInfo,
  type Application,
  type ApplicationStatus,
  type Interview,
} from "@/lib/store";
import Link from "next/link";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Application>>({});
  const [interviewForm, setInterviewForm] = useState({ round: "", type: "Coding", date: "", feedback: "" });
  const [mounted, setMounted] = useState(false);

  const id = typeof params.id === "string" ? params.id : "";

  function reload() {
    const found = getApplication(id);
    setApp(found ?? null);
    if (found) {
      const allInterviews = getInterviews().filter((i) => i.applicationId === found.id || i.company === found.companyName);
      setInterviews(allInterviews);
    }
  }

  useEffect(() => {
    reload();
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!mounted) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" /></div>;
  }

  if (!app) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed border-white/10 bg-white/5 text-center py-12">
          <p className="text-lg font-semibold text-white">Application not found</p>
          <p className="mt-2 text-sm text-slate-400">This application may have been deleted.</p>
          <Link href="/applications" className="mt-4 inline-block">
            <Button className="bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950"><ArrowLeft className="mr-2 h-4 w-4" /> Back to applications</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const stage = getStageInfo(app.status);

  function handleStatusChange(newStatus: ApplicationStatus) {
    updateApplication(id, { status: newStatus });
    reload();
    toast.success("Status updated!");
  }

  function handleSaveEdit() {
    updateApplication(id, editForm);
    setEditing(false);
    reload();
    toast.success("Application updated!");
  }

  function handleDelete() {
    deleteApplication(id);
    toast.success("Application deleted");
    router.push("/applications");
  }

  function handleAddInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!interviewForm.round.trim()) {
      toast.error("Round name is required");
      return;
    }
    addInterview({
      applicationId: app!.id,
      company: app!.companyName,
      round: interviewForm.round,
      type: interviewForm.type,
      date: interviewForm.date,
      outcome: "Pending",
      feedback: interviewForm.feedback,
    });
    setInterviewForm({ round: "", type: "Coding", date: "", feedback: "" });
    reload();
    toast.success("Interview round added!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/applications">
          <Button className="bg-white/10 text-slate-100 hover:bg-white/15 p-2"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            title={`${app.companyName} · ${app.jobRole}`}
            description="Manage this application record, change status, add interview rounds, and track progress."
            actionLabel={editing ? "Save changes" : "Edit"}
            onAction={editing ? handleSaveEdit : () => { setEditForm(app); setEditing(true); }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Application details */}
        <Card className="border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Application details</h3>

          {/* Status pipeline */}
          <div className="mb-6">
            <Label>Current stage</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {APPLICATION_STAGES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    app.status === s.value
                      ? `${s.color} ring-2 ring-white/20`
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {editing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Company</Label><Input value={editForm.companyName ?? ""} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} /></div>
              <div><Label>Role</Label><Input value={editForm.jobRole ?? ""} onChange={(e) => setEditForm({ ...editForm, jobRole: e.target.value })} /></div>
              <div><Label>CTC</Label><Input value={editForm.packageCtc ?? ""} onChange={(e) => setEditForm({ ...editForm, packageCtc: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={editForm.location ?? ""} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></div>
              <div><Label>Application Date</Label><Input type="date" value={editForm.applicationDate ?? ""} onChange={(e) => setEditForm({ ...editForm, applicationDate: e.target.value })} /></div>
              <div><Label>Deadline</Label><Input type="date" value={editForm.deadlineDate ?? ""} onChange={(e) => setEditForm({ ...editForm, deadlineDate: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Notes</Label><Textarea value={editForm.notes ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} /></div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-300">
              <div>Company: <span className="text-white font-medium">{app.companyName}</span></div>
              <div>Role: <span className="text-white font-medium">{app.jobRole}</span></div>
              <div>CTC: <span className="text-white font-medium">{app.packageCtc || "–"}</span></div>
              <div>Location: <span className="text-white font-medium">{app.location || "–"}</span></div>
              <div>Applied: <span className="text-white font-medium">{app.applicationDate ? format(new Date(app.applicationDate), "MMM d, yyyy") : "–"}</span></div>
              <div>Deadline: <span className="text-white font-medium">{app.deadlineDate ? format(new Date(app.deadlineDate), "MMM d, yyyy") : "–"}</span></div>
              <div>Source: <span className="text-white font-medium">{app.source || "–"}</span></div>
              <div>Resume: <span className="text-white font-medium">{app.resumeVersionUsed || "–"}</span></div>
              {app.referralInformation && <div className="md:col-span-2">Referral: <span className="text-white font-medium">{app.referralInformation}</span></div>}
              {app.notes && <div className="md:col-span-2">Notes: <span className="text-white font-medium">{app.notes}</span></div>}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleDelete} className="bg-rose-500/10 border-rose-400/30 text-rose-200 hover:bg-rose-500/20 gap-2">
              <Trash2 className="h-4 w-4" /> Delete application
            </Button>
          </div>
        </Card>

        {/* Interview rounds */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="h-5 w-5 text-violet-300" />
              <h3 className="text-lg font-semibold text-white">Interview rounds</h3>
            </div>
            {interviews.length === 0 ? (
              <p className="text-sm text-slate-400">No interview rounds recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((interview) => (
                  <div key={interview.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300">
                    <p className="font-medium text-white">{interview.round}</p>
                    <p className="mt-1">Type: {interview.type} · Outcome: <Badge className={interview.outcome === "Passed" ? "bg-emerald-400/10 text-emerald-200" : interview.outcome === "Failed" ? "bg-rose-400/10 text-rose-200" : "bg-amber-400/10 text-amber-200"}>{interview.outcome}</Badge></p>
                    {interview.date && <p className="mt-1 text-slate-400">{format(new Date(interview.date), "MMM d, yyyy h:mm a")}</p>}
                    {interview.feedback && <p className="mt-1 text-xs text-slate-500 italic">{interview.feedback}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-white/10 bg-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Add interview round</h3>
            <form className="space-y-3" onSubmit={handleAddInterview}>
              <div><Label>Round name *</Label><Input placeholder="e.g. Round 1, HR, OA" value={interviewForm.round} onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })} /></div>
              <div>
                <Label>Type</Label>
                <Select value={interviewForm.type} onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}>
                  <option value="Coding">Coding</option>
                  <option value="System Design">System Design</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Technical">Technical</option>
                  <option value="HR">HR</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Online Assessment">Online Assessment</option>
                </Select>
              </div>
              <div><Label>Date &amp; time</Label><Input type="datetime-local" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} /></div>
              <div><Label>Feedback / notes</Label><Textarea placeholder="Interview feedback..." value={interviewForm.feedback} onChange={(e) => setInterviewForm({ ...interviewForm, feedback: e.target.value })} /></div>
              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950">Save interview round</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
