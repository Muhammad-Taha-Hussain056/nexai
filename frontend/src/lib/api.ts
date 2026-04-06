export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNextPage?: boolean;
  };
}

export interface BackendModel {
  id: string;
  name: string;
  lab: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  icon?: string;
  contextWindow?: string;
  latency?: string;
  types?: string[];
  priceLabel?: string;
  pricePerMTokenInput?: number;
  openSource?: boolean;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('nexus_auth_token');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || json.error) {
    throw new Error(json.error?.message ?? 'API request failed');
  }
  if (!json.data) {
    throw new Error('API returned empty payload');
  }
  return json.data;
}

export async function fetchModels(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  return request<BackendModel[]>(`/api/v1/models?${query.toString()}`);
}

export async function generateOnboardingPrompt(task: string) {
  return request<{ generatedPrompt: string }>('/api/v1/onboarding/prompt', {
    method: 'POST',
    body: JSON.stringify({
      answers: { task },
      userTypedQuery: task,
    }),
  });
}

export async function saveOnboarding(task: string, sessionId: string) {
  return request<{ profileId: string }>('/api/v1/onboarding', {
    method: 'POST',
    body: JSON.stringify({
      answers: { task },
      sessionId,
    }),
  });
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; name: string } }>(`/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe() {
  return request<{ id: string; email: string; name: string; role: string }>(`/api/v1/auth/me`);
}
