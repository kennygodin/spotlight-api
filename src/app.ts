import express, { NextFunction, Request, Response } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';

import { errorHandler } from './middlewares/errorHandler';
import ratelimiter from './middlewares/rateLimiter';

import itemRoutes from './routes/item.route';
import userRoutes from './routes/user.route';

const app = express();

app.use(clerkMiddleware());
app.use(ratelimiter);
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Healthy' });
});

app.get('/api/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route');
});

app.use(errorHandler);

export default app;
