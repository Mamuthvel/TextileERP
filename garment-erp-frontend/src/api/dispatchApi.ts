import { baseApi, type ApiResponse } from '../app/baseApi';
import type { Dispatch, Invoice } from '../types';

export const dispatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDispatches: builder.query<ApiResponse<Dispatch[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/dispatch', params: params || {} }),
      providesTags: [{ type: 'Dispatch', id: 'LIST' }],
    }),
    createDispatch: builder.mutation<ApiResponse<Dispatch>, Partial<Dispatch>>({
      query: (body) => ({ url: '/dispatch', method: 'POST', body }),
      invalidatesTags: [{ type: 'Dispatch', id: 'LIST' }],
    }),
    updateDispatch: builder.mutation<ApiResponse<Dispatch>, { id: string; body: Partial<Dispatch> }>({
      query: ({ id, body }) => ({ url: `/dispatch/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Dispatch', id: 'LIST' }],
    }),
    getInvoices: builder.query<ApiResponse<Invoice[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/invoices', params: params || {} }),
      providesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
    createInvoice: builder.mutation<ApiResponse<Invoice>, Partial<Invoice>>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
    updateInvoice: builder.mutation<ApiResponse<Invoice>, { id: string; body: Partial<Invoice> }>({
      query: ({ id, body }) => ({ url: `/invoices/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDispatchesQuery,
  useCreateDispatchMutation,
  useUpdateDispatchMutation,
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} = dispatchApi;
