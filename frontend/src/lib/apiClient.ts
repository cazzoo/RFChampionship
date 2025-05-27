import { supabase } from './supabaseClient'; // Your Supabase client from a previous step

interface RequestOptions extends RequestInit {
  // You can define a more specific type for the body if needed
  body?: any; 
}

const apiClient = {
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', url, undefined, options);
  },
  async post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>('POST', url, body, options);
  },
  async put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', url, body, options);
  },
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', url, undefined, options);
  },
};

async function request<T>(method: string, url: string, body?: any, options?: RequestOptions): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options?.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  if (method !== 'GET' && method !== 'HEAD') { // GET/HEAD requests cannot have a body
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    method,
    headers,
    ...options, // Spread other options like mode, cache, etc.
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  
  // Construct the full URL if your API is hosted separately
  // For this project, assuming backend is on the same origin or proxied, so relative URLs work.
  // const baseUrl = import.meta.env.VITE_API_BASE_URL || ''; // e.g., http://localhost:3001/api
  // const fullUrl = `${baseUrl}${url}`;
  const fullUrl = url; // Assuming /api/... routes are handled by the same server or a proxy

  try {
    const response = await fetch(fullUrl, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    if (response.status === 204) { // No Content
        return null as T; // Or handle as appropriate for your use case
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error; // Re-throw to be caught by the calling hook/component
  }
}

export default apiClient;
