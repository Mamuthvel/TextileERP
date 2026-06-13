import { baseApi, type ApiResponse } from '../app/baseApi';
import type { Order } from '../types';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Order[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/orders', params: params || {} }),
      providesTags: (result) =>
        result
          ? [...result.data.map((o) => ({ type: 'Order' as const, id: o._id })), { type: 'Order', id: 'LIST' }]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrder: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<ApiResponse<Order>, Partial<Order>>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Dashboard', id: 'SUMMARY' }],
    }),
    updateOrder: builder.mutation<ApiResponse<Order>, { id: string; body: Partial<Order> }>({
      query: ({ id, body }) => ({ url: `/orders/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
    approveOrder: builder.mutation<ApiResponse<Order>, { id: string; note?: string }>({
      query: ({ id, note }) => ({ url: `/orders/${id}/approve`, method: 'PATCH', body: { note } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }, { type: 'Dashboard', id: 'SUMMARY' }],
    }),
    deleteOrder: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useApproveOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
