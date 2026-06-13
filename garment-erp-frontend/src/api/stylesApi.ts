import { baseApi, type ApiResponse } from '../app/baseApi';

export interface Style {
  _id: string;
  styleNo: string;
  orderId?: string;
  description?: string;
  fabric?: string;
  fabricGSM?: number;
  trims?: string[];
  status: 'design' | 'approved' | 'inProduction';
  createdAt: string;
}

export const stylesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStyles: builder.query<ApiResponse<Style[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/styles', params: params || {} }),
      providesTags: [{ type: 'Style', id: 'LIST' }],
    }),
    createStyle: builder.mutation<ApiResponse<Style>, Partial<Style>>({
      query: (body) => ({ url: '/styles', method: 'POST', body }),
      invalidatesTags: [{ type: 'Style', id: 'LIST' }],
    }),
    updateStyle: builder.mutation<ApiResponse<Style>, { id: string; body: Partial<Style> }>({
      query: ({ id, body }) => ({ url: `/styles/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Style', id: 'LIST' }],
    }),
  }),
});

export const { useGetStylesQuery, useCreateStyleMutation, useUpdateStyleMutation } = stylesApi;
