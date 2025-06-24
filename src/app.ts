import express, {  Request, Response } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import fileUpload from 'express-fileupload';

import ratelimiter from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';

import itemRoutes from './routes/item.route';
import postRoutes from './routes/post.route';
import manageUserWebhooksRoute from './routes/user.route';
import uploadRoutes from './routes/upload.route';

const app = express();

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
app.use('/api/items', itemRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/uploads', uploadRoutes);

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
