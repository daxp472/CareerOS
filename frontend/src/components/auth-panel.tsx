"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { Badge, Button, Card, Input, Textarea } from "@/components/ui";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [status, setStatus] = useState<string>("Ready to connect to the backend API.");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{ fullName: string; email: string; password: string; role: "STUDENT" | "ADMIN"; resetEmail: string }>({
    fullName: "",
    email: "student@careeros.app",
    password: "Password@123",
    role: "STUDENT",
    resetEmail: "student@careeros.app",
  });

  async function submit(event: import("react").FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const response = await api.login({ email: form.email, password: form.password });
        setToken(response.data.token);
        setStatus(`Logged in as ${response.data.fullName} (${response.data.role}). Token prefix: ${response.data.token.slice(0, 18)}...`);
        router.push("/dashboard");
      } else if (mode === "register") {
        const response = await api.register({ fullName: form.fullName || "CareerOS Student", email: form.email, password: form.password, role: form.role });
        setToken(response.data.token);
        setStatus(`Registered account for ${response.data.fullName}. Token prefix: ${response.data.token.slice(0, 18)}...`);
        router.push("/dashboard");
      } else {
        const token = await api.forgotPassword({ email: form.resetEmail });
        setStatus(`Reset token generated: ${token.data}`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to reach backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-5 bg-slate-950/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Authentication</p>
          <h3 className="text-xl font-semibold text-white">JWT sign-in flow</h3>
        </div>
        <Badge className="bg-cyan-400/10 text-cyan-100">RBAC ready</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 text-sm">
        {(["login", "register", "forgot"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-xl px-3 py-2 capitalize transition ${mode === item ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5"}`}>
            {item}
          </button>
        ))}
      </div>

      <form className="space-y-3" onSubmit={submit}>
        {mode === "register" && <Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Full name" />}
        {(mode === "login" || mode === "register") && <Input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" type="email" />}
        {mode !== "forgot" && <Input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" type="password" />}
        {mode === "register" && (
          <div className="flex gap-2">
            <button type="button" onClick={() => setForm({ ...form, role: "STUDENT" })} className={`flex-1 rounded-2xl border px-4 py-3 text-sm ${form.role === "STUDENT" ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300"}`}>
              Student
            </button>
            <button type="button" onClick={() => setForm({ ...form, role: "ADMIN" })} className={`flex-1 rounded-2xl border px-4 py-3 text-sm ${form.role === "ADMIN" ? "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-100" : "border-white/10 bg-white/5 text-slate-300"}`}>
              Admin
            </button>
          </div>
        )}
        {mode === "forgot" && <Input value={form.resetEmail} onChange={(event) => setForm({ ...form, resetEmail: event.target.value })} placeholder="Recovery email" type="email" />}
        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 hover:opacity-90">
          {loading ? "Working..." : mode === "forgot" ? "Generate reset token" : mode === "register" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <Textarea readOnly value={status} className="min-h-[88px] resize-none" />
    </Card>
  );
}
