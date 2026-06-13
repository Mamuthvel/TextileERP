import { baseApi, type ApiResponse } from '../app/baseApi';
import type { PurchaseOrder } from '../types';

export const poApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query<ApiResponse<PurchaseOrder[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/purchase-orders', params: params || {} }),
      providesTags: [{ type: 'PO', id: 'LIST' }],
    }),
    createPurchaseOrder: builder.mutation<ApiResponse<PurchaseOrder>, Partial<PurchaseOrder>>({
      query: (body) => ({ url: '/purchase-orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'PO', id: 'LIST' }],
    }),
    updatePurchaseOrder: builder.mutation<ApiResponse<PurchaseOrder>, { id: string; body: Partial<PurchaseOrder> }>({
      query: ({ id, body }) => ({ url: `/purchase-orders/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'PO', id: 'LIST' }],
    }),
  }),
});

export const { useGetPurchaseOrdersQuery, useCreatePurchaseOrderMutation, useUpdatePurchaseOrderMutation } = poApi;
