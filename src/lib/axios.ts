import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

export class SpotifyApiError extends Error {
  status: number;
  reason?: string;

  constructor(message: string, status: number, reason?: string) {
    super(message);
    this.name = 'SpotifyApiError';
    this.status = status;
    this.reason = reason;
  }
}

export class PremiumRequiredError extends SpotifyApiError {
  constructor() {
    super('Spotify Premium required', 403, 'PREMIUM_REQUIRED');
    this.name = 'PremiumRequiredError';
  }
}

export class RateLimitError extends Error {
  retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

const axiosInstance = axios.create({
  baseURL: SPOTIFY_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        config.headers['Content-Type'] = 'application/json';
      }
    } catch (error) {
      console.error('Failed to get session:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as { error?: { reason?: string; message?: string } };

    // 401 - Unauthorized: clear session and redirect to login
    if (status === 401) {
      console.error('Unauthorized - clearing session');
      await signOut({ redirect: true, callbackUrl: '/login' });
      return Promise.reject(new SpotifyApiError('Unauthorized', 401));
    }

    // 429 - Rate Limited: extract Retry-After and retry
    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      const retryAfterSeconds = retryAfter ? parseInt(retryAfter as string, 10) : 1;
      console.warn(`Rate limited. Retrying after ${retryAfterSeconds} seconds...`);

      // Wait and retry
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));

      // Retry the original request
      const originalRequest = error.config;
      if (originalRequest) {
        return axiosInstance(originalRequest);
      }
    }

    // 403 - Premium Required
    if (status === 403 && data?.error?.reason === 'PREMIUM_REQUIRED') {
      return Promise.reject(new PremiumRequiredError());
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Spotify API Error:', {
        status,
        message: data?.error?.message || error.message,
        reason: data?.error?.reason,
        url: error.config?.url,
      });
    }

    return Promise.reject(
      new SpotifyApiError(
        data?.error?.message || error.message,
        status || 500,
        data?.error?.reason
      )
    );
  }
);

// Typed API methods
export async function get<T>(url: string, config?: object): Promise<T> {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
}

export async function post<T>(url: string, data?: unknown, config?: object): Promise<T> {
  const response = await axiosInstance.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(url: string, data?: unknown, config?: object): Promise<T> {
  const response = await axiosInstance.put<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: object): Promise<T> {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
}

export default axiosInstance;
