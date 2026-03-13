import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmapRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import skillRoutes from './routes/skillRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  ...((process.env.FRONTEND_URL || 'http://localhost:3000').split(',')),
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'CareerRoad AI Backend API v1' });
});

app.use(errorHandler);

export default app;
