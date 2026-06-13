import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // Send the httpOnly cookie on every request
    credentials: 'include',
  }),
  tagTypes: [
    'Order',
    'Inventory',
    'InventoryTxn',
    'Production',
    'Costing',
    'Quality',
    'PO',
    'Dispatch',
    'Invoice',
    'User',
    'Style',
    'Dashboard',
  ],
  endpoints: () => ({}),
});

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
