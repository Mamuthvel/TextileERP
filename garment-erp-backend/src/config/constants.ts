export enum ROLES {
  SUPER_ADMIN = 'superAdmin',
  PRODUCTION_MANAGER = 'productionManager',
  MERCHANDISER = 'merchandiser',
  QC_INSPECTOR = 'qcInspector',
  ACCOUNTS = 'accounts',
  VIEWER = 'viewer',
}

export const ORDER_STATUS = [
  'enquiry', 'quotation', 'confirmed', 'inProduction', 'dispatched', 'invoiced', 'closed',
] as const;
export type OrderStatus = typeof ORDER_STATUS[number];

export const PRODUCTION_STAGES = [
  'knitting', 'yarnDyeing', 'greyFabricReceipt', 'fabricDyeing', 'finishing',
  'fabricCutting', 'sewing', 'ironing', 'packing', 'finalInspection',
] as const;
export type ProductionStage = typeof PRODUCTION_STAGES[number];

export const STAGE_ORDER = PRODUCTION_STAGES;
