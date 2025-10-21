import useSWR, { mutate, SWRResponse } from 'swr';
import { apiClient } from './apiClient';
import { encodeQuery, QueryParams } from './utils';

export interface CRUDResource<T> {
  getAll: (query?: QueryParams) => SWRResponse<T, any>;
  getOne: (id: string | number) => SWRResponse<T, any>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string | number, data: Partial<T>) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}

export function createResource<T>(basePath: string): CRUDResource<T> {
  return {
    getAll: (query?: QueryParams) => {
        const safeQuery = query ? { ...query } : undefined;

      const queryString = safeQuery ? `?q=${encodeQuery(safeQuery)}` : '';
      const url = `${basePath}${queryString}`;

      return useSWR<T>(url, () => apiClient(url), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      });
    },

    getOne: (id) => useSWR<T>(`${basePath}/${id}`, () => apiClient(`${basePath}/${id}`), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }),

    create: async (data) => {
        let body: any;
  let headers: Record<string, string> = {};

  if (data instanceof FormData) {
    // If it's FormData (for file uploads), send as-is
    body = data;
    // Do NOT set Content-Type; browser sets it automatically
  } else {
    // Otherwise, send JSON
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

      const newItem = await apiClient(basePath, 'POST', data);
      mutate(basePath); // You may want to mutate with the same query if using getAll(query)
      return newItem;
    },

    update: async (id, data) => {
      const updated = await apiClient(`${basePath}/${id}`, 'PUT', data);
      mutate(basePath);
      return updated;
    },

    delete: async (id) => {
      await apiClient(`${basePath}/${id}`, 'DELETE');
      mutate(basePath);
    },
  };
}
