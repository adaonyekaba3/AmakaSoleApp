import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import scanRoutes from './routes/scans';
import gaitRoutes from './routes/gait';
import orthoticRoutes from './routes/orthotics';
import orderRoutes from './routes/orders';
import partnerRoutes from './routes/partners';
import { errorHandler } from './middleware/errorHandler';

// Load job processors (side-effect imports)
import './jobs/process-scan.job';
import './jobs/analyze-gait.job';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(','), credentials: true }));

// Raw body for Stripe webhook (must be before express.json())
app.use('/api/orders/stripe-webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'healthy' } });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/gait', gaitRoutes);
app.use('/api/orthotics', orthoticRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('API server running on port ' + PORT);
});
