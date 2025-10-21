import { BASE_URL } from './config';
console.log('BASE_URL:', BASE_URL);

export const apiClient = async (path: string, method = 'GET', body?: any) => {
  const finalPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${finalPath}`;

  // Decide headers
  let headers: Record<string, string> = {};

  // Only set JSON headers if body is not FormData
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = body ? JSON.stringify(body) : undefined;
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ API error on ${url}:`, res.status, text);
    throw new Error(`Request failed with ${res.status}`);
  }

  return res.json();
};
