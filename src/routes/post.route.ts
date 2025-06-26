import { NextFunction, Request, Response, Router } from 'express';
import { requireAuth } from '@clerk/express';

import {
  createPost,
  getFeedPosts,
  getUserPosts,
} from '../controllers/post.controller';

const router = Router();

router.post(
  '/create',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('CREATE POST ENDPOINT HIT');

    next();
  },
  createPost,
);

router.get(
  '/user/:clerkId',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('MY POSTS ENDPOINT HIT');
    next();
  },
  getUserPosts,
);

router.get(
  '/feed-posts',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('FEED POST ENDPOINT HIT');
    next();
  },
  getFeedPosts,
);

export default router;
