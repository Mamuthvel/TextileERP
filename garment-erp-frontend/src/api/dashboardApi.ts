import { baseApi, type ApiResponse } from '../app/baseApi';

export interface DashboardSummary {
  kpis: {
    totalOrders: number;
    inProduction: number;
    dispatched: number;
    lowStockCount: number;
  };
  productionByStage: { _id: string; planned: number; actual: number; count: number }[];
  pnl: { totalCost: number; totalRevenue: number; profit: number };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<ApiResponse<DashboardSummary>, void>({
      query: () => '/dashboard/summary',
      providesTags: [{ type: 'Dashboard', id: 'SUMMARY' }],
    }),
    getOrderSummaryReport: builder.query<ApiResponse<any>, void>({
      query: () => '/dashboard/orders-summary',
    }),
    getProductionEfficiencyReport: builder.query<ApiResponse<any[]>, void>({
      query: () => '/dashboard/production-efficiency',
    }),
    getInventoryAgingReport: builder.query<ApiResponse<any[]>, Record<string, any> | void>({
      query: (params) => ({ url: '/dashboard/inventory-aging', params: params || {} }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetOrderSummaryReportQuery,
  useGetProductionEfficiencyReportQuery,
  useGetInventoryAgingReportQuery,
  useLazyGetInventoryAgingReportQuery,
} = dashboardApi;
