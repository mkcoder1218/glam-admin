import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// utils/queryBuilder.ts
export interface QueryParams {
  filters?: Record<string, any>;           // exact match filters
  search?: Record<string, string>;         // full-text search
  limit?: number;
  offset?: number;
  order?: [string, "ASC" | "DESC"][];
  include?: any[];
}

// Encode query (frontend & Node.js)
export const encodeQuery = (params: QueryParams) => {
  const clean = JSON.parse(JSON.stringify(params)); // removes non-serializable fields
  if (typeof window !== 'undefined') {
    return btoa(JSON.stringify(clean));
  }
  return Buffer.from(JSON.stringify(clean)).toString('base64');
};

// Decode query
export const decodeQuery = (encoded: string): QueryParams => {
  try {
    const json =
      typeof window !== "undefined"
        ? atob(encoded)
        : Buffer.from(encoded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return {};
  }
};
