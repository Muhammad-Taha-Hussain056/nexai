const BACKEND_URL = 'http://localhost:3001/api/auth';

export interface User {
  id: number;
  fullName: string;
  email: string;
  created_at?: string;
  full_name?: string; // Some endpoints might return this
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  async signup(data: { fullName: string; email: string; password: string }) {
    const res = await fetch(`${BACKEND_URL}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create account');
    return res.json();
  },

  async signin(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${BACKEND_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async logout(refreshToken: string) {
    // The user mentioned port 3000 but I'll use 3001 for consistency
    const res = await fetch(`${BACKEND_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return res.ok;
  },

  async getMe(token: string) {
    const res = await fetch(`${BACKEND_URL}/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  }
};
