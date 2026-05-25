const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

const TOKEN_KEY = "careeros-token";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? payload?.error ?? `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  login: (body: { email: string; password: string }) => request<{ success: boolean; message: string; data: { token: string; tokenType: string; userId: number; fullName: string; email: string; role: "STUDENT" | "ADMIN" } }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { fullName: string; email: string; password: string; role: "STUDENT" | "ADMIN" }) => request<{ success: boolean; message: string; data: { token: string; tokenType: string; userId: number; fullName: string; email: string; role: "STUDENT" | "ADMIN" } }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body: { email: string }) => request<{ success: boolean; message: string; data: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  profile: () => request("/auth/me"),
  updateProfile: (body: { fullName: string; phone?: string; department?: string; graduationYear?: number; cgpa?: number; skillSummary?: string; dateOfBirth?: string }) => request("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
  dashboard: () => request("/dashboard"),
  analytics: () => request("/analytics"),
  activity: () => request("/activity"),
  applications: (query?: string) => request(`/applications${query ? `?${query}` : ""}`),
  application: (id: number) => request(`/applications/${id}`),
  createApplication: (body: unknown) => request("/applications", { method: "POST", body: JSON.stringify(body) }),
  updateApplication: (id: number, body: unknown) => request(`/applications/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteApplication: (id: number) => request(`/applications/${id}`, { method: "DELETE" }),
  reminders: () => request("/reminders"),
  upcomingReminders: () => request("/reminders/upcoming"),
  createReminder: (body: unknown) => request("/reminders", { method: "POST", body: JSON.stringify(body) }),
  updateReminder: (id: number, body: unknown) => request(`/reminders/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  completeReminder: (id: number) => request(`/reminders/${id}/complete`, { method: "PUT" }),
  deleteReminder: (id: number) => request(`/reminders/${id}`, { method: "DELETE" }),
  resumes: () => request("/resumes"),
  uploadResume: async (formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
      cache: "no-store",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message ?? payload?.error ?? `Request failed with status ${response.status}`);
    }
    return response.json();
  },
  markDefaultResume: (id: number) => request(`/resumes/${id}/default`, { method: "PUT" }),
  deleteResume: (id: number) => request(`/resumes/${id}`, { method: "DELETE" }),
  skills: () => request("/skills"),
  createSkill: (body: unknown) => request("/skills", { method: "POST", body: JSON.stringify(body) }),
  updateSkill: (id: number, body: unknown) => request(`/skills/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSkill: (id: number) => request(`/skills/${id}`, { method: "DELETE" }),
  goals: () => request("/goals"),
  createGoal: (body: unknown) => request("/goals", { method: "POST", body: JSON.stringify(body) }),
  updateGoal: (id: number, body: unknown) => request(`/goals/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteGoal: (id: number) => request(`/goals/${id}`, { method: "DELETE" }),
  interviewExperiences: () => request("/interview-experiences"),
  createInterviewExperience: (body: unknown) => request("/interview-experiences", { method: "POST", body: JSON.stringify(body) }),
  updateInterviewExperience: (id: number, body: unknown) => request(`/interview-experiences/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteInterviewExperience: (id: number) => request(`/interview-experiences/${id}`, { method: "DELETE" }),
  questionBank: (companyName?: string) => request(`/company-question-bank${companyName ? `?companyName=${encodeURIComponent(companyName)}` : ""}`),
  createQuestion: (body: unknown) => request("/company-question-bank", { method: "POST", body: JSON.stringify(body) }),
  updateQuestion: (id: number, body: unknown) => request(`/company-question-bank/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteQuestion: (id: number) => request(`/company-question-bank/${id}`, { method: "DELETE" }),
};

export { API_BASE_URL };
