import express, { Request, Response } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import fileUpload from 'express-fileupload';

import ratelimiter from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';
import job from './config/cron';

import postRoutes from './routes/post.route';
import userRoutes from './routes/user.route';
import manageUserWebhooksRoute from './routes/webhook.route';
import uploadRoutes from './routes/upload.route';
import followRoutes from './routes/follow.route';

const app = express();

if (process.env.NODE_ENV === 'production') job.start();

app.use('/api', manageUserWebhooksRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(ratelimiter);
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

// Routes

app.use('/api/posts', postRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follows', followRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Healthy' });
});

app.get('/api/protected', requireAuth(), (req: Request, res: Response) => {
  const auth = req.auth!();
  const userId = auth?.userId;
  res.json({
    message: 'This is a protected route',
    userId: userId,
  });
});

app.use(errorHandler);

export default app;
