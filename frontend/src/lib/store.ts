/* ────────────────────────────────────────────────────────────
   CareerOS – localStorage-backed reactive store
   Works fully offline, no backend required.
   ────────────────────────────────────────────────────────── */

// ── Types ───────────────────────────────────────────────────

export type ApplicationStatus =
  | "APPLIED"
  | "OA_SCHEDULED"
  | "OA_CLEARED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_DONE"
  | "HR_ROUND"
  | "OFFER_RECEIVED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export const APPLICATION_STAGES: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "APPLIED", label: "Applied", color: "bg-blue-400/20 text-blue-200 border-blue-400/30" },
  { value: "OA_SCHEDULED", label: "OA Scheduled", color: "bg-amber-400/20 text-amber-200 border-amber-400/30" },
  { value: "OA_CLEARED", label: "OA Cleared", color: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", color: "bg-violet-400/20 text-violet-200 border-violet-400/30" },
  { value: "INTERVIEW_DONE", label: "Interview Done", color: "bg-cyan-400/20 text-cyan-200 border-cyan-400/30" },
  { value: "HR_ROUND", label: "HR Round", color: "bg-pink-400/20 text-pink-200 border-pink-400/30" },
  { value: "OFFER_RECEIVED", label: "Offer Received", color: "bg-emerald-400/20 text-emerald-100 border-emerald-400/30" },
  { value: "ACCEPTED", label: "Accepted", color: "bg-green-500/20 text-green-200 border-green-500/30" },
  { value: "REJECTED", label: "Rejected", color: "bg-rose-400/20 text-rose-200 border-rose-400/30" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "bg-slate-400/20 text-slate-300 border-slate-400/30" },
];

export function getStageInfo(status: ApplicationStatus) {
  return APPLICATION_STAGES.find((s) => s.value === status) ?? APPLICATION_STAGES[0];
}

export interface Application {
  id: string;
  companyName: string;
  jobRole: string;
  packageCtc: string;
  location: string;
  applicationDate: string;
  deadlineDate: string;
  status: ApplicationStatus;
  resumeVersionUsed: string;
  referralInformation: string;
  notes: string;
  source: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  company: string;
  round: string;
  type: string;
  date: string;
  outcome: string;
  feedback: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "COMPLETED" | "DISMISSED";
  reminderType: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  name: string;
  tag: string;
  defaultResume: boolean;
  notes: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  skillName: string;
  category: string;
  progressPercentage: number;
  notes: string;
  targetDate: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progressPercentage: number;
  status: string;
  targetDate: string;
  createdAt: string;
}

export interface InterviewExperience {
  id: string;
  companyName: string;
  questionsAsked: string;
  topicsCovered: string;
  learnings: string;
  notes: string;
  interviewDate: string;
  createdAt: string;
}

export interface QuestionEntry {
  id: string;
  companyName: string;
  question: string;
  category: string;
  difficulty: string;
  tags: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  message: string;
  timestamp: string;
}

// ── Helpers ─────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function logActivity(message: string) {
  const activities = read<ActivityEntry>("careeros-activities");
  activities.unshift({ id: uid(), message, timestamp: new Date().toISOString() });
  if (activities.length > 100) activities.length = 100;
  write("careeros-activities", activities);
}

// ── Applications ────────────────────────────────────────────

export function getApplications(): Application[] {
  return read<Application>("careeros-applications");
}

export function getApplication(id: string): Application | undefined {
  return getApplications().find((a) => a.id === id);
}

export function addApplication(data: Omit<Application, "id" | "createdAt">): Application {
  const apps = getApplications();
  const app: Application = { ...data, id: uid(), createdAt: new Date().toISOString() };
  apps.unshift(app);
  write("careeros-applications", apps);
  logActivity(`Added application for ${app.companyName} – ${app.jobRole}`);
  return app;
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  const old = apps[idx];
  apps[idx] = { ...old, ...updates };
  write("careeros-applications", apps);
  if (updates.status && updates.status !== old.status) {
    logActivity(`Status changed for ${old.companyName}: ${old.status} → ${updates.status}`);
  } else {
    logActivity(`Updated application for ${old.companyName}`);
  }
  return apps[idx];
}

export function deleteApplication(id: string) {
  const apps = getApplications();
  const app = apps.find((a) => a.id === id);
  write("careeros-applications", apps.filter((a) => a.id !== id));
  if (app) logActivity(`Deleted application for ${app.companyName}`);
}

// ── Interviews ──────────────────────────────────────────────

export function getInterviews(): Interview[] {
  return read<Interview>("careeros-interviews");
}

export function addInterview(data: Omit<Interview, "id" | "createdAt">): Interview {
  const list = getInterviews();
  const item: Interview = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-interviews", list);
  logActivity(`Interview added: ${item.company} – ${item.round}`);
  return item;
}

export function deleteInterview(id: string) {
  const list = getInterviews();
  write("careeros-interviews", list.filter((i) => i.id !== id));
}

// ── Reminders ───────────────────────────────────────────────

export function getReminders(): Reminder[] {
  return read<Reminder>("careeros-reminders");
}

export function addReminder(data: Omit<Reminder, "id" | "createdAt">): Reminder {
  const list = getReminders();
  const item: Reminder = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-reminders", list);
  logActivity(`Reminder created: ${item.title}`);
  return item;
}

export function updateReminder(id: string, updates: Partial<Reminder>) {
  const list = getReminders();
  const idx = list.findIndex((r) => r.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    write("careeros-reminders", list);
  }
}

export function deleteReminder(id: string) {
  const list = getReminders();
  write("careeros-reminders", list.filter((r) => r.id !== id));
}

// ── Resumes ─────────────────────────────────────────────────

export function getResumes(): Resume[] {
  return read<Resume>("careeros-resumes");
}

export function addResume(data: Omit<Resume, "id" | "createdAt">): Resume {
  const list = getResumes();
  if (data.defaultResume) list.forEach((r) => (r.defaultResume = false));
  const item: Resume = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-resumes", list);
  logActivity(`Resume uploaded: ${item.name}`);
  return item;
}

export function setDefaultResume(id: string) {
  const list = getResumes();
  list.forEach((r) => (r.defaultResume = r.id === id));
  write("careeros-resumes", list);
  logActivity(`Default resume changed`);
}

export function deleteResume(id: string) {
  const list = getResumes();
  write("careeros-resumes", list.filter((r) => r.id !== id));
}

// ── Skills ──────────────────────────────────────────────────

export function getSkills(): Skill[] {
  return read<Skill>("careeros-skills");
}

export function addSkill(data: Omit<Skill, "id" | "createdAt">): Skill {
  const list = getSkills();
  const item: Skill = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-skills", list);
  logActivity(`Skill added: ${item.skillName}`);
  return item;
}

export function updateSkill(id: string, updates: Partial<Skill>) {
  const list = getSkills();
  const idx = list.findIndex((s) => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    write("careeros-skills", list);
  }
}

export function deleteSkill(id: string) {
  const list = getSkills();
  write("careeros-skills", list.filter((s) => s.id !== id));
}

// ── Goals ───────────────────────────────────────────────────

export function getGoals(): Goal[] {
  return read<Goal>("careeros-goals");
}

export function addGoal(data: Omit<Goal, "id" | "createdAt">): Goal {
  const list = getGoals();
  const item: Goal = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-goals", list);
  logActivity(`Goal added: ${item.title}`);
  return item;
}

export function updateGoal(id: string, updates: Partial<Goal>) {
  const list = getGoals();
  const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    write("careeros-goals", list);
  }
}

export function deleteGoal(id: string) {
  const list = getGoals();
  write("careeros-goals", list.filter((g) => g.id !== id));
}

// ── Interview Experiences ───────────────────────────────────

export function getInterviewExperiences(): InterviewExperience[] {
  return read<InterviewExperience>("careeros-interview-experiences");
}

export function addInterviewExperience(data: Omit<InterviewExperience, "id" | "createdAt">): InterviewExperience {
  const list = getInterviewExperiences();
  const item: InterviewExperience = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-interview-experiences", list);
  logActivity(`Interview note saved for ${item.companyName}`);
  return item;
}

export function deleteInterviewExperience(id: string) {
  const list = getInterviewExperiences();
  write("careeros-interview-experiences", list.filter((e) => e.id !== id));
}

// ── Question Bank ───────────────────────────────────────────

export function getQuestions(): QuestionEntry[] {
  return read<QuestionEntry>("careeros-questions");
}

export function addQuestion(data: Omit<QuestionEntry, "id" | "createdAt">): QuestionEntry {
  const list = getQuestions();
  const item: QuestionEntry = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  write("careeros-questions", list);
  logActivity(`Question added for ${item.companyName}`);
  return item;
}

export function deleteQuestion(id: string) {
  const list = getQuestions();
  write("careeros-questions", list.filter((q) => q.id !== id));
}

// ── Activity ────────────────────────────────────────────────

export function getActivities(): ActivityEntry[] {
  return read<ActivityEntry>("careeros-activities");
}

// ── Seed Data ───────────────────────────────────────────────

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("careeros-seeded")) return;

  // Seed applications
  const apps: Application[] = [
    { id: uid(), companyName: "PhonePe", jobRole: "Software Engineer Intern", packageCtc: "₹18 LPA", location: "Bengaluru", applicationDate: "2026-06-12", deadlineDate: "2026-06-20", status: "INTERVIEW_SCHEDULED", resumeVersionUsed: "Resume V4", referralInformation: "Alumni referral", notes: "System design round pending", source: "College portal", createdAt: "2026-06-12T10:00:00Z" },
    { id: uid(), companyName: "Microsoft", jobRole: "SDE Intern", packageCtc: "₹45 LPA", location: "Hyderabad", applicationDate: "2026-06-10", deadlineDate: "2026-06-18", status: "OA_SCHEDULED", resumeVersionUsed: "Resume V3", referralInformation: "", notes: "Aptitude + coding round", source: "LinkedIn", createdAt: "2026-06-10T08:00:00Z" },
    { id: uid(), companyName: "Flipkart", jobRole: "Backend Intern", packageCtc: "₹22 LPA", location: "Remote", applicationDate: "2026-06-08", deadlineDate: "", status: "OA_CLEARED", resumeVersionUsed: "Resume V4", referralInformation: "Referral", notes: "Waiting for interview slot", source: "Referral", createdAt: "2026-06-08T09:00:00Z" },
    { id: uid(), companyName: "Meesho", jobRole: "Full Stack Intern", packageCtc: "₹16 LPA", location: "Bengaluru", applicationDate: "2026-06-05", deadlineDate: "", status: "REJECTED", resumeVersionUsed: "Resume V2", referralInformation: "", notes: "Did not clear OA", source: "Manual", createdAt: "2026-06-05T11:00:00Z" },
    { id: uid(), companyName: "Google", jobRole: "SWE Intern", packageCtc: "₹55 LPA", location: "Bengaluru", applicationDate: "2026-06-14", deadlineDate: "2026-06-25", status: "APPLIED", resumeVersionUsed: "Resume V4", referralInformation: "", notes: "Applied via careers page", source: "Careers page", createdAt: "2026-06-14T10:00:00Z" },
    { id: uid(), companyName: "Razorpay", jobRole: "Backend Intern", packageCtc: "₹20 LPA", location: "Bengaluru", applicationDate: "2026-06-13", deadlineDate: "2026-06-22", status: "OFFER_RECEIVED", resumeVersionUsed: "Resume V4", referralInformation: "Senior referral", notes: "Got offer! Need to decide", source: "Referral", createdAt: "2026-06-13T14:00:00Z" },
  ];
  write("careeros-applications", apps);

  // Seed interviews
  const interviews: Interview[] = [
    { id: uid(), applicationId: apps[0].id, company: "PhonePe", round: "Round 2", type: "System Design", date: "2026-06-18T18:30", outcome: "Pending", feedback: "", createdAt: "2026-06-15T10:00:00Z" },
    { id: uid(), applicationId: apps[1].id, company: "Microsoft", round: "Online Assessment", type: "Coding", date: "2026-06-17T09:00", outcome: "Scheduled", feedback: "", createdAt: "2026-06-14T08:00:00Z" },
    { id: uid(), applicationId: apps[2].id, company: "Flipkart", round: "HR Round", type: "Behavioral", date: "2026-06-09T14:00", outcome: "Passed", feedback: "Communication was strong", createdAt: "2026-06-09T15:00:00Z" },
  ];
  write("careeros-interviews", interviews);

  // Seed reminders
  const reminders: Reminder[] = [
    { id: uid(), title: "PhonePe System Design Prep", description: "Revise caching, load balancing, DB sharding for Round 2", dueDate: "2026-06-18T15:00", priority: "HIGH", status: "PENDING", reminderType: "INTERVIEW_PREP", createdAt: new Date().toISOString() },
    { id: uid(), title: "Microsoft OA Tomorrow", description: "Practice 2 medium + 1 hard problems tonight", dueDate: "2026-06-17T08:00", priority: "HIGH", status: "PENDING", reminderType: "DEADLINE", createdAt: new Date().toISOString() },
    { id: uid(), title: "Update resume with Razorpay project", description: "Add the offer details and backend project to CV V5", dueDate: "2026-06-20T18:00", priority: "MEDIUM", status: "PENDING", reminderType: "CUSTOM", createdAt: new Date().toISOString() },
    { id: uid(), title: "Follow up with Flipkart HR", description: "Send thank-you email after HR round", dueDate: "2026-06-16T10:00", priority: "LOW", status: "COMPLETED", reminderType: "FOLLOW_UP", createdAt: new Date().toISOString() },
  ];
  write("careeros-reminders", reminders);

  // Seed resumes
  const resumes: Resume[] = [
    { id: uid(), name: "Resume V1", tag: "Core DSA", defaultResume: false, notes: "Used for mass applications", createdAt: "2026-05-01T10:00:00Z" },
    { id: uid(), name: "Resume V2", tag: "Frontend", defaultResume: false, notes: "Highlights React projects", createdAt: "2026-05-15T10:00:00Z" },
    { id: uid(), name: "Resume V3", tag: "Full Stack", defaultResume: false, notes: "Spring Boot + React projects", createdAt: "2026-06-01T10:00:00Z" },
    { id: uid(), name: "Resume V4", tag: "Backend", defaultResume: true, notes: "Current default – Java + Spring Boot focused", createdAt: "2026-06-10T10:00:00Z" },
  ];
  write("careeros-resumes", resumes);

  // Seed skills
  const skills: Skill[] = [
    { id: uid(), skillName: "DSA", category: "CODING", progressPercentage: 72, notes: "Revise arrays, trees, DP", targetDate: "2026-07-10", createdAt: new Date().toISOString() },
    { id: uid(), skillName: "System Design", category: "ARCHITECTURE", progressPercentage: 48, notes: "Read HLD basics + caching", targetDate: "2026-08-01", createdAt: new Date().toISOString() },
    { id: uid(), skillName: "Spring Boot", category: "BACKEND", progressPercentage: 80, notes: "Focus on JPA and security", targetDate: "2026-06-28", createdAt: new Date().toISOString() },
    { id: uid(), skillName: "React & Next.js", category: "FRONTEND", progressPercentage: 65, notes: "Pages, hooks, forms", targetDate: "2026-07-05", createdAt: new Date().toISOString() },
  ];
  write("careeros-skills", skills);

  // Seed goals
  const goals: Goal[] = [
    { id: uid(), title: "Solve 300 DSA questions", description: "LeetCode + Striver sheet combined count", progressPercentage: 64, status: "IN_PROGRESS", targetDate: "2026-09-01", createdAt: new Date().toISOString() },
    { id: uid(), title: "Complete Striver Sheet", description: "Full A-Z sheet with notes", progressPercentage: 42, status: "IN_PROGRESS", targetDate: "2026-08-15", createdAt: new Date().toISOString() },
    { id: uid(), title: "System Design Course", description: "Grokking + YouTube series", progressPercentage: 25, status: "NOT_STARTED", targetDate: "2026-07-20", createdAt: new Date().toISOString() },
  ];
  write("careeros-goals", goals);

  // Seed interview experiences
  const experiences: InterviewExperience[] = [
    { id: uid(), companyName: "PhonePe", questionsAsked: "LRU Cache, concurrency basics, API design", topicsCovered: "Caching, multithreading", learnings: "Speak clearly and structure answers", notes: "Need more distributed systems prep", interviewDate: "2026-06-12T14:00", createdAt: new Date().toISOString() },
    { id: uid(), companyName: "Flipkart", questionsAsked: "Binary tree traversal, SQL join query", topicsCovered: "Trees, DBMS", learnings: "Explain tradeoffs first", notes: "Good communication mattered", interviewDate: "2026-06-09T14:00", createdAt: new Date().toISOString() },
  ];
  write("careeros-interview-experiences", experiences);

  // Seed questions
  const questions: QuestionEntry[] = [
    { id: uid(), companyName: "Microsoft", question: "Design an authentication service", category: "System Design", difficulty: "HARD", tags: "auth, oauth, jwt", createdAt: new Date().toISOString() },
    { id: uid(), companyName: "PhonePe", question: "Implement LRU cache with eviction", category: "DSA", difficulty: "MEDIUM", tags: "cache, hashmap, lru", createdAt: new Date().toISOString() },
    { id: uid(), companyName: "Flipkart", question: "Explain ACID properties with examples", category: "DBMS", difficulty: "EASY", tags: "database, transactions", createdAt: new Date().toISOString() },
  ];
  write("careeros-questions", questions);

  // Seed activities
  const activities: ActivityEntry[] = [
    { id: uid(), message: "Application added for PhonePe – Software Engineer Intern", timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: uid(), message: "Resume V4 set as default", timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: uid(), message: "Reminder created: Microsoft OA Tomorrow", timestamp: new Date(Date.now() - 180000).toISOString() },
    { id: uid(), message: "Interview note saved for Flipkart", timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: uid(), message: "Goal progress updated: Solve 300 DSA questions → 64%", timestamp: new Date(Date.now() - 300000).toISOString() },
  ];
  write("careeros-activities", activities);

  localStorage.setItem("careeros-seeded", "true");
}

// ── Dashboard Stats ─────────────────────────────────────────

export function getDashboardStats() {
  const apps = getApplications();
  const reminders = getReminders();
  const goals = getGoals();

  const totalApps = apps.length;
  const pendingReminders = reminders.filter((r) => r.status === "PENDING").length;
  const offers = apps.filter((a) => a.status === "OFFER_RECEIVED" || a.status === "ACCEPTED").length;
  const avgGoalProgress = goals.length ? Math.round(goals.reduce((sum, g) => sum + g.progressPercentage, 0) / goals.length) : 0;

  return [
    { label: "Applications", value: String(totalApps), delta: `${apps.filter((a) => a.status !== "REJECTED" && a.status !== "WITHDRAWN").length} active`, tone: "from-cyan-500/20 to-blue-500/20" },
    { label: "Reminders", value: String(pendingReminders), delta: `${reminders.filter((r) => r.priority === "HIGH" && r.status === "PENDING").length} high priority`, tone: "from-amber-500/20 to-orange-500/20" },
    { label: "Offers", value: String(offers), delta: offers > 0 ? "Congratulations! 🎉" : "Keep going! 💪", tone: "from-emerald-500/20 to-lime-500/20" },
    { label: "Goal Progress", value: `${avgGoalProgress}%`, delta: `${goals.filter((g) => g.status === "IN_PROGRESS").length} goals in motion`, tone: "from-fuchsia-500/20 to-pink-500/20" },
  ];
}

export function getUpcomingItems() {
  const apps = getApplications();
  const interviews = getInterviews();
  const reminders = getReminders().filter((r) => r.status === "PENDING").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const upcoming: { title: string; subtitle: string; date: string; type: "interview" | "reminder" | "deadline"; urgency: "high" | "medium" | "low" }[] = [];

  for (const interview of interviews) {
    if (interview.outcome === "Pending" || interview.outcome === "Scheduled") {
      upcoming.push({
        title: `${interview.company} – ${interview.round}`,
        subtitle: interview.type,
        date: interview.date,
        type: "interview",
        urgency: "high",
      });
    }
  }

  for (const reminder of reminders.slice(0, 5)) {
    upcoming.push({
      title: reminder.title,
      subtitle: reminder.description,
      date: reminder.dueDate,
      type: "reminder",
      urgency: reminder.priority === "HIGH" ? "high" : reminder.priority === "MEDIUM" ? "medium" : "low",
    });
  }

  for (const app of apps) {
    if (app.deadlineDate && app.status !== "REJECTED" && app.status !== "WITHDRAWN") {
      upcoming.push({
        title: `${app.companyName} deadline`,
        subtitle: app.jobRole,
        date: app.deadlineDate,
        type: "deadline",
        urgency: "medium",
      });
    }
  }

  return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 8);
}

// ── Admin Stats ─────────────────────────────────────────────

export function getAdminStats() {
  const apps = getApplications();
  const interviews = getInterviews();
  const reminders = getReminders();
  const resumes = getResumes();
  const skills = getSkills();
  const goals = getGoals();
  const experiences = getInterviewExperiences();
  const questions = getQuestions();

  const statusBreakdown: Record<string, number> = {};
  for (const app of apps) {
    statusBreakdown[app.status] = (statusBreakdown[app.status] || 0) + 1;
  }

  return {
    totalApplications: apps.length,
    totalInterviews: interviews.length,
    totalReminders: reminders.length,
    totalResumes: resumes.length,
    totalSkills: skills.length,
    totalGoals: goals.length,
    totalExperiences: experiences.length,
    totalQuestions: questions.length,
    statusBreakdown,
    pendingReminders: reminders.filter((r) => r.status === "PENDING").length,
    completedReminders: reminders.filter((r) => r.status === "COMPLETED").length,
    offerRate: apps.length ? Math.round((apps.filter((a) => a.status === "OFFER_RECEIVED" || a.status === "ACCEPTED").length / apps.length) * 100) : 0,
  };
}
