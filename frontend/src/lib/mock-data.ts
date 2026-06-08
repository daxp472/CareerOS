export const summaryCards = [
  { label: "Total Applications", value: "128", delta: "+18 this month", tone: "from-cyan-500/20 to-blue-500/20" },
  { label: "Pending Applications", value: "34", delta: "8 deadlines this week", tone: "from-emerald-500/20 to-lime-500/20" },
  { label: "Interview Scheduled", value: "12", delta: "4 tomorrow", tone: "from-amber-500/20 to-orange-500/20" },
  { label: "Offers Received", value: "6", delta: "2 active negotiations", tone: "from-fuchsia-500/20 to-pink-500/20" },
];

export const pipeline = [
  "Applied",
  "OA Scheduled",
  "OA Cleared",
  "Interview Scheduled",
  "HR Round",
  "Offer Received",
  "Rejected",
];

export const applicationRows = [
  { company: "PhonePe", role: "Software Engineer Intern", ctc: "₹18 LPA", status: "Interview Scheduled", date: "2026-06-12", location: "Bengaluru", resume: "CV v4", referral: "Alumni referral" },
  { company: "Microsoft", role: "SDE Intern", ctc: "₹45 LPA", status: "OA Scheduled", date: "2026-06-10", location: "Hyderabad", resume: "CV v3", referral: "No" },
  { company: "Flipkart", role: "Backend Intern", ctc: "₹22 LPA", status: "OA Cleared", date: "2026-06-08", location: "Remote", resume: "CV v4", referral: "Referral" },
  { company: "Meesho", role: "Full Stack Intern", ctc: "₹16 LPA", status: "Rejected", date: "2026-06-05", location: "Bengaluru", resume: "CV v2", referral: "No" },
];

export const upcomingDeadlines = [
  { title: "PhonePe interview", when: "Today, 6:30 PM", note: "Round 2 system design prep" },
  { title: "Microsoft OA", when: "Tomorrow, 9:00 AM", note: "Resume-aligned aptitude sprint" },
  { title: "Resume lock", when: "In 3 days", note: "Switch default to CV v4" },
];

export const activityFeed = [
  "Submitted a PhonePe application with referral note",
  "Marked Microsoft OA as scheduled",
  "Uploaded resume version CV v4",
  "Logged feedback from Flipkart interview",
];

export const chartData = [
  { month: "Jan", applications: 10, offers: 1, rejections: 2 },
  { month: "Feb", applications: 14, offers: 1, rejections: 3 },
  { month: "Mar", applications: 18, offers: 2, rejections: 4 },
  { month: "Apr", applications: 22, offers: 2, rejections: 5 },
  { month: "May", applications: 28, offers: 3, rejections: 4 },
  { month: "Jun", applications: 36, offers: 6, rejections: 6 },
];

export const authStats = [
  { label: "Students onboarded", value: "2,400+" },
  { label: "Interview notes captured", value: "9,800+" },
  { label: "Resumes stored", value: "5,200+" },
];
