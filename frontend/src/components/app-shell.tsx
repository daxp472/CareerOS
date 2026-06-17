"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Search, Sparkles } from "lucide-react";
import { navItems } from "@/lib/navigation";
import { Button, Card } from "@/components/ui";
import { clearToken } from "@/lib/api";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="sticky top-0 flex h-screen flex-col p-4">
            <div className="mb-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">CareerOS</p>
                <p className="text-xs text-slate-400">Personal career OS</p>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              Search modules
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Card className="mt-4 border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Session</p>
              <p className="mt-2 text-sm text-slate-200">Logged in student session</p>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    clearToken();
                    router.push("/auth");
                  }}
                  className="w-full gap-2 bg-white/10 text-slate-100 hover:bg-white/15"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </Card>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 text-slate-100 hover:bg-white/15 lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <p className="text-sm text-slate-400">Career Operating System</p>
                <h1 className="text-2xl font-semibold tracking-tight text-white">Student Career Tracker</h1>
              </div>
            </div>
          </div>
          <div className="px-4 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
