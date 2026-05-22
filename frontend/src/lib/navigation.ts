import type { LucideIcon } from "lucide-react";
import { Activity, BarChart3, BookText, CalendarClock, FileText, Goal, Home, Layers3, Settings2, ShieldCheck, Sparkles, SquareStack, Target, Users2, UserCircle2, ClipboardList } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/interviews", label: "Interviews", icon: Users2 },
  { href: "/reminders", label: "Reminders", icon: CalendarClock },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/skills", label: "Skills", icon: Target },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/interview-experiences", label: "Interview Notes", icon: BookText },
  { href: "/company-question-bank", label: "Question Bank", icon: SquareStack },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export const quickActions = [
  { label: "New application", href: "/applications/new", icon: Sparkles },
  { label: "Add reminder", href: "/reminders", icon: CalendarClock },
  { label: "Track skills", href: "/skills", icon: Target },
  { label: "Write interview note", href: "/interview-experiences", icon: BookText },
];
