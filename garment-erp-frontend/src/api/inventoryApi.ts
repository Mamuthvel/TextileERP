import { baseApi, type ApiResponse } from '../app/baseApi';
import type { InventoryItem, StockTransaction } from '../types';

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<ApiResponse<InventoryItem[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/inventory', params: params || {} }),
      providesTags: (result) =>
        result
          ? [...result.data.map((i) => ({ type: 'Inventory' as const, id: i._id })), { type: 'Inventory', id: 'LIST' }]
          : [{ type: 'Inventory', id: 'LIST' }],
    }),
    createInventoryItem: builder.mutation<ApiResponse<InventoryItem>, Partial<InventoryItem>>({
      query: (body) => ({ url: '/inventory', method: 'POST', body }),
      invalidatesTags: [{ type: 'Inventory', id: 'LIST' }],
    }),
    updateInventoryItem: builder.mutation<ApiResponse<InventoryItem>, { id: string; body: Partial<InventoryItem> }>({
      query: ({ id, body }) => ({ url: `/inventory/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Inventory', id: 'LIST' }],
    }),
    getTransactions: builder.query<ApiResponse<StockTransaction[]>, { id?: string } & Record<string, any>>({
      query: ({ id, ...params }) => ({ url: id ? `/inventory/${id}/transactions` : '/inventory/transactions/all', params }),
      providesTags: [{ type: 'InventoryTxn', id: 'LIST' }],
    }),
    createTransaction: builder.mutation<ApiResponse<any>, Partial<StockTransaction>>({
      query: (body) => ({ url: '/inventory/transactions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Inventory', id: 'LIST' }, { type: 'InventoryTxn', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
} = inventoryApi;
