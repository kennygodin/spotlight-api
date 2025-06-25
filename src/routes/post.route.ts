import { NextFunction, Request, Response, Router } from 'express';
import { requireAuth } from '@clerk/express';

import {
  createPost,
  getLoggedInUserPosts,
} from '../controllers/post.controller';

const router = Router();

router.post(
  '/create',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('🛑 Request reached create post endpoint');
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
    console.log('Body:', req.body);
    next();
  },
  createPost,
);

router.get(
  '/my-posts',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT USER ENDPOINT HIT');
    next();
  },
  getLoggedInUserPosts,
);

export default router;
