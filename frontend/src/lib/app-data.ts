export const dashboardStats = [
  { label: "Applications", value: "128", delta: "+18 this month", tone: "from-cyan-500/20 to-blue-500/20" },
  { label: "Reminders", value: "14", delta: "5 due soon", tone: "from-amber-500/20 to-orange-500/20" },
  { label: "Offers", value: "6", delta: "2 active", tone: "from-emerald-500/20 to-lime-500/20" },
  { label: "Goal progress", value: "72%", delta: "3 goals in motion", tone: "from-fuchsia-500/20 to-pink-500/20" },
];

export const dashboardReminders = [
  { title: "PhonePe interview prep", dueDate: "Today, 6:30 PM", priority: "High", status: "Pending" },
  { title: "System design revision", dueDate: "Tomorrow, 8:00 PM", priority: "Medium", status: "Pending" },
  { title: "Mark resume v4 default", dueDate: "Fri, 6:00 PM", priority: "Low", status: "Completed" },
];

export const dashboardActivities = [
  "Application added for PhonePe",
  "Resume v4 uploaded as default",
  "Reminder created for Microsoft OA",
  "Goal progress updated for Striver Sheet",
];

export const applicationList = [
  { id: 1, company: "PhonePe", role: "Software Engineer Intern", ctc: "₹18 LPA", status: "Interview Scheduled", date: "2026-06-12", location: "Bengaluru" },
  { id: 2, company: "Microsoft", role: "SDE Intern", ctc: "₹45 LPA", status: "OA Scheduled", date: "2026-06-10", location: "Hyderabad" },
  { id: 3, company: "Flipkart", role: "Backend Intern", ctc: "₹22 LPA", status: "OA Cleared", date: "2026-06-08", location: "Remote" },
  { id: 4, company: "Meesho", role: "Full Stack Intern", ctc: "₹16 LPA", status: "Rejected", date: "2026-06-05", location: "Bengaluru" },
];

export const interviewList = [
  { company: "PhonePe", round: "Round 2", type: "System Design", date: "2026-06-15 18:30", outcome: "Pending" },
  { company: "Microsoft", round: "OA", type: "Coding", date: "2026-06-16 09:00", outcome: "Scheduled" },
  { company: "Flipkart", round: "HR", type: "Behavioral", date: "2026-06-09 14:00", outcome: "Passed" },
];

export const resumeList = [
  { name: "Resume V1", tag: "Core DSA", defaultResume: false, notes: "Used for mass applications" },
  { name: "Resume V2", tag: "Frontend", defaultResume: false, notes: "Highlights React projects" },
  { name: "Resume V4", tag: "Backend", defaultResume: true, notes: "Current default for backend roles" },
  { name: "ATS Resume", tag: "ATS", defaultResume: false, notes: "Keyword optimized version" },
];

export const skillList = [
  { name: "DSA", progress: 72, notes: "Revise arrays, trees, DP", targetDate: "2026-07-10" },
  { name: "System Design", progress: 48, notes: "Read HLD basics + caching", targetDate: "2026-08-01" },
  { name: "Spring Boot", progress: 80, notes: "Focus on JPA and security", targetDate: "2026-06-28" },
  { name: "React", progress: 65, notes: "Pages, hooks, forms", targetDate: "2026-07-05" },
];

export const goalList = [
  { title: "Solve 300 DSA questions", progress: 64, status: "In Progress", targetDate: "2026-09-01" },
  { title: "Complete Striver Sheet", progress: 42, status: "In Progress", targetDate: "2026-08-15" },
  { title: "Finish System Design course", progress: 25, status: "Not Started", targetDate: "2026-07-20" },
];

export const interviewExperienceList = [
  { company: "PhonePe", questions: "LRU Cache, concurrency basics, API design", topics: "Caching, multithreading", learnings: "Speak clearly and structure answers", notes: "Need more distributed systems prep" },
  { company: "Flipkart", questions: "Binary tree traversal, SQL join query", topics: "Trees, DBMS", learnings: "Explain tradeoffs first", notes: "Good communication mattered" },
];

export const questionBankList = [
  { company: "Microsoft", question: "Design an authentication service", category: "System Design", difficulty: "Hard", tags: "auth, oauth, jwt" },
  { company: "PhonePe", question: "Implement caching with eviction", category: "DSA", difficulty: "Medium", tags: "cache, hashmap, lru" },
  { company: "Flipkart", question: "Explain ACID with examples", category: "DBMS", difficulty: "Easy", tags: "database, transactions" },
];

export const analyticsSeries = [
  { month: "Jan", applications: 10, interviews: 2, offers: 1, rejections: 2 },
  { month: "Feb", applications: 14, interviews: 4, offers: 1, rejections: 3 },
  { month: "Mar", applications: 18, interviews: 6, offers: 2, rejections: 4 },
  { month: "Apr", applications: 22, interviews: 8, offers: 2, rejections: 5 },
  { month: "May", applications: 28, interviews: 11, offers: 3, rejections: 4 },
  { month: "Jun", applications: 36, interviews: 14, offers: 6, rejections: 6 },
];
