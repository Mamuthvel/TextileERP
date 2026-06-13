import { baseApi, type ApiResponse } from '../app/baseApi';
import type { UserAccount } from '../types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<UserAccount[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/users', params: params || {} }),
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation<ApiResponse<UserAccount>, Partial<UserAccount> & { password: string }>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<ApiResponse<UserAccount>, { id: string; body: Partial<UserAccount> & { password?: string } }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
