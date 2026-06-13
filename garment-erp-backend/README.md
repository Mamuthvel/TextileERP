# Loomline ERP — Backend (Node.js / Express / MongoDB)

## Setup

```bash
cd backend
cp .env.example .env   # update MONGODB_URI and JWT_SECRET
npm install
npm run seed            # creates a Super Admin + sample data
npm run dev              # starts on http://localhost:5000
```

Default seeded login: `admin@garmenterp.com` / `Admin@123`

## Modules
- **Auth** — JWT login/register, role-based access (`/api/auth`)
- **Orders** — order book, status flow, timeline (`/api/orders`)
- **Styles & BOM** — design library, bill of materials (`/api/styles`)
- **Procurement** — purchase orders (`/api/purchase-orders`)
- **Inventory** — stock items + GRN/issue/transfer transactions (`/api/inventory`)
- **Production** — stage-wise production orders, daily output, stage advance (`/api/production`)
- **Quality** — AQL inspections & defect tracking (`/api/quality`)
- **Costing** — estimate vs post-production cost sheets, variance (`/api/costing`)
- **Dispatch** — carton packing & shipment tracking (`/api/dispatch`)
- **Invoicing** — export invoices, duty drawback, credit advice (`/api/invoices`)
- **Dashboard/Reports** — KPIs, P&L, production efficiency, inventory aging (`/api/dashboard`)
- **Users** — user/role management (`/api/users`, Super Admin only)

## Roles
`superAdmin`, `productionManager`, `merchandiser`, `qcInspector`, `accounts`, `viewer`
