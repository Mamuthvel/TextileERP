import { baseApi, type ApiResponse } from '../app/baseApi';
import type { ProductionOrder } from '../types';

export const productionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductionOrders: builder.query<ApiResponse<ProductionOrder[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/production', params: params || {} }),
      providesTags: (result) =>
        result
          ? [...result.data.map((p) => ({ type: 'Production' as const, id: p._id })), { type: 'Production', id: 'LIST' }]
          : [{ type: 'Production', id: 'LIST' }],
    }),
    createProductionOrder: builder.mutation<ApiResponse<ProductionOrder>, Partial<ProductionOrder>>({
      query: (body) => ({ url: '/production', method: 'POST', body }),
      invalidatesTags: [{ type: 'Production', id: 'LIST' }],
    }),
    addDailyProduction: builder.mutation<ApiResponse<ProductionOrder>, { id: string; body: { date: string; qty: number; shift: string } }>({
      query: ({ id, body }) => ({ url: `/production/${id}/daily`, method: 'POST', body }),
      invalidatesTags: [{ type: 'Production', id: 'LIST' }, { type: 'Dashboard', id: 'SUMMARY' }],
    }),
    advanceStage: builder.mutation<ApiResponse<ProductionOrder>, { id: string; override?: boolean }>({
      query: ({ id, override }) => ({ url: `/production/${id}/advance`, method: 'POST', body: { override } }),
      invalidatesTags: [{ type: 'Production', id: 'LIST' }],
    }),
    updateProductionOrder: builder.mutation<ApiResponse<ProductionOrder>, { id: string; body: Partial<ProductionOrder> }>({
      query: ({ id, body }) => ({ url: `/production/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Production', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductionOrdersQuery,
  useCreateProductionOrderMutation,
  useAddDailyProductionMutation,
  useAdvanceStageMutation,
  useUpdateProductionOrderMutation,
} = productionApi;
