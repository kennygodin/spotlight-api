import express, { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { manageUserWebhooks } from '../controllers/user.controller';

const router = Router();

router.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  manageUserWebhooks,
);

export default router;
