import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { notFound, errorHandler } from './middleware/error';
import { globalRateLimit, authRateLimit } from './middleware/security';
import { auditLog } from './middleware/auditLog';

import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import styleRoutes from './routes/styleRoutes';
import poRoutes from './routes/poRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import productionRoutes from './routes/productionRoutes';
import qualityRoutes from './routes/qualityRoutes';
import costingRoutes from './routes/costingRoutes';
import dispatchRoutes from './routes/dispatchRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

const allowedClientUrls = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedClientUrls.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy: Origin not allowed'), false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Strip $ and . from user input to prevent NoSQL injection
app.use(mongoSanitize());

app.use(morgan('dev'));

// Apply global rate limit to all API routes
app.use('/api', globalRateLimit);

// Audit log all mutations (POST/PUT/PATCH/DELETE)
app.use('/api', auditLog);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'up' }, message: 'Garment ERP API running' });
});

app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/costing', costingRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;
