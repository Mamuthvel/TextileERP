import { baseApi, type ApiResponse } from '../app/baseApi';
import type { QualityInspection } from '../types';

export const qualityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query<ApiResponse<QualityInspection[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/quality', params: params || {} }),
      providesTags: [{ type: 'Quality', id: 'LIST' }],
    }),
    createInspection: builder.mutation<ApiResponse<QualityInspection>, Partial<QualityInspection>>({
      query: (body) => ({ url: '/quality', method: 'POST', body }),
      invalidatesTags: [{ type: 'Quality', id: 'LIST' }],
    }),
  }),
});

export const { useGetInspectionsQuery, useCreateInspectionMutation } = qualityApi;
