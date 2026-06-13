import { baseApi, type ApiResponse } from '../app/baseApi';
import type { Costing } from '../types';

export const costingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCostings: builder.query<ApiResponse<Costing[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/costing', params: params || {} }),
      providesTags: [{ type: 'Costing', id: 'LIST' }],
    }),
    createCosting: builder.mutation<ApiResponse<Costing>, Partial<Costing>>({
      query: (body) => ({ url: '/costing', method: 'POST', body }),
      invalidatesTags: [{ type: 'Costing', id: 'LIST' }, { type: 'Dashboard', id: 'SUMMARY' }],
    }),
    updateCosting: builder.mutation<ApiResponse<Costing>, { id: string; body: Partial<Costing> }>({
      query: ({ id, body }) => ({ url: `/costing/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Costing', id: 'LIST' }, { type: 'Dashboard', id: 'SUMMARY' }],
    }),
    compareCosting: builder.query<ApiResponse<{ estimate: Costing; post: Costing; variance: Record<string, any> }>, string>({
      query: (orderId) => `/costing/compare/${orderId}`,
    }),
  }),
});

export const {
  useGetCostingsQuery,
  useCreateCostingMutation,
  useUpdateCostingMutation,
  useCompareCostingQuery,
} = costingApi;
