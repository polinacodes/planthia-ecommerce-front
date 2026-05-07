// lib/auth.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ========
// TIPOS
// ========

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  jwt: string;
  user: UserData;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
}

// ==============
// AUTENTICACIÓN 
// ==============

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/custom-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al registrar usuario');
  }

  return data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  // const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
  const res = await fetch(`${STRAPI_URL}/api/auth/custom-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Credenciales inválidas');
  }

  return data;
}

export async function forgotPassword(email: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${STRAPI_URL}/api/auth/custom-forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al enviar el código');
  }

  return data;
}

export async function resetPassword(input: ResetPasswordInput): Promise<AuthResponse> {
  // const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
  const res = await fetch(`${STRAPI_URL}/api/auth/custom-reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al cambiar la contraseña');
  }

  return data;
}

export async function changePassword(input: ChangePasswordInput): Promise<AuthResponse> {
  const token = getToken();

  const res = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al cambiar la contraseña');
  }

  return data;
}

// ============================================
// UTILIDADES DE TOKEN (CLIENT-SIDE)
// ============================================

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

// ============================================
// FETCH AUTENTICADO (PARA ENDPOINTS PROTEGIDOS)
// ============================================

export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || `Error ${res.status}`);
  }

  return data;
}