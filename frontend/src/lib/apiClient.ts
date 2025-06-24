import { supabase } from './supabaseClient';

interface RequestOptions<T = unknown> extends Omit<RequestInit, 'body'> {
  body?: T;
}

const apiClient = {
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', url, undefined, options);
  },
  async post<T, B = unknown>(url: string, body?: B, options?: RequestOptions<B>): Promise<T> {
    return request<T, B>('POST', url, body, options);
  },
  async put<T, B = unknown>(url: string, body?: B, options?: RequestOptions<B>): Promise<T> {
    return request<T, B>('PUT', url, body, options);
  },
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', url, undefined, options);
  },
};

async function request<T, B = unknown>(method: string, url: string, body?: B, options?: RequestOptions<B>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options?.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  if (method !== 'GET' && method !== 'HEAD') {
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    method,
    headers,
    ...options,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = url;

  try {
    const response = await fetch(fullUrl, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    if (response.status === 204) {
        return null as T;
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
}

export default apiClient;
