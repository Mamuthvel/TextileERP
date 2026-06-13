export interface Assortment {
  size: string;
  color: string;
  quantity: number;
}

export interface TimelineEvent {
  event: string;
  note?: string;
  by?: string;
  at: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  type: 'sample' | 'bulk';
  buyer: string;
  agent?: string;
  styleCategory?: string;
  season?: string;
  deliveryDate?: string;
  destination?: string;
  garmentAssortments: Assortment[];
  status: 'enquiry' | 'quotation' | 'confirmed' | 'inProduction' | 'dispatched' | 'invoiced' | 'closed';
  agentCommission?: number;
  remarks?: string;
  orderTimeline: TimelineEvent[];
  totalQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  _id: string;
  itemCode: string;
  category: 'yarn' | 'greyFabric' | 'finishedFabric' | 'trim' | 'packingMaterial';
  description: string;
  uom: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  location: string;
  minStockLevel: number;
  updatedAt: string;
}

export interface StockTransaction {
  _id: string;
  transactionType: 'GRN' | 'issue' | 'transfer' | 'return' | 'adjustment';
  inventoryId: string;
  orderId?: string;
  quantity: number;
  uom?: string;
  reference?: string;
  inspectionResult?: 'passed' | 'failed' | 'conditional';
  billNo?: string;
  billAmount?: number;
  createdAt: string;
}

export type ProductionStage =
  | 'knitting'
  | 'yarnDyeing'
  | 'greyFabricReceipt'
  | 'fabricDyeing'
  | 'finishing'
  | 'fabricCutting'
  | 'sewing'
  | 'ironing'
  | 'packing'
  | 'finalInspection';

export interface ProductionOrder {
  _id: string;
  prodOrderNo: string;
  orderId: string;
  styleId?: string;
  stage: ProductionStage;
  processUnit?: string;
  plannedQuantity: number;
  actualQuantity: number;
  operator?: string;
  supervisor?: string;
  machineName?: string;
  startDate?: string;
  endDate?: string;
  status: 'planned' | 'inProgress' | 'completed' | 'onHold';
  dailyProduction: { date: string; qty: number; shift: string }[];
  progress?: number;
  createdAt: string;
}

export interface Costing {
  _id: string;
  orderId: string;
  type: 'estimate' | 'post';
  yarnCost: number;
  fabricCost: number;
  trimmingCost: number;
  dyeingCost: number;
  sewingCost: number;
  overheadCost: number;
  packingCost: number;
  totalCost: number;
  sellingPrice: number;
  profitMargin?: number;
  currency: string;
  createdAt: string;
}

export interface QualityInspection {
  _id: string;
  inspectionType: 'fabricInspection' | 'sewingInline' | 'finalInspection' | 'auditInspection';
  orderId?: string;
  productionOrderId?: string;
  inspectionDate: string;
  sampleSize: number;
  defectsFound: { defectType: string; count: number }[];
  totalDefects: number;
  result: 'pass' | 'fail' | 'conditional';
  remarks?: string;
  createdAt: string;
}

export interface PurchaseOrder {
  _id: string;
  poNo: string;
  orderId?: string;
  vendor: string;
  items: { description: string; quantity: number; uom: string; unitPrice: number; totalPrice: number }[];
  totalAmount: number;
  currency: string;
  expectedDelivery?: string;
  status: 'draft' | 'sent' | 'acknowledged' | 'partiallyReceived' | 'fullyReceived' | 'closed';
  createdAt: string;
}

export interface Dispatch {
  _id: string;
  dispatchNo: string;
  orderId?: string;
  lorryNo?: string;
  blNo?: string;
  cartons: { cartonNo: string; qty: number; grossWeight: number; netWeight: number }[];
  totalCartons: number;
  totalQuantity: number;
  shippingStatus: 'pending' | 'packed' | 'shipped' | 'delivered';
  dispatchDate?: string;
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  orderId?: string;
  buyer?: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  totalAmount: number;
  currency: string;
  dutyDrawback: number;
  creditAdvice: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  invoiceDate: string;
}

export interface UserAccount {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
}
