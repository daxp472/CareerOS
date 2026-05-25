import { AuthPanel } from "@/components/auth-panel";
import { Badge, Card } from "@/components/ui";
import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-8 text-slate-100 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100">CareerOS student login</Badge>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">Your placement life, finally in one place.</h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Sign in to track applications, reminders, resumes, interview notes, skills, and goals without treating your career like a job board.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Applications", "Track every company and status"],
              ["Reminders", "Never miss deadlines or follow-ups"],
              ["Notes", "Build your private interview memory"],
            ].map(([title, text]) => (
              <Card key={title} className="border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </Card>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            New here? Use register inside the form. Want to jump straight into the app? <Link className="text-cyan-300 underline-offset-4 hover:underline" href="/dashboard">Open dashboard</Link>.
          </p>
        </section>
        <AuthPanel />
      </div>
    </main>
  );
}