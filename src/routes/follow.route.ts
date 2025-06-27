import { NextFunction, Request, Response, Router } from 'express';
import { requireAuth } from '@clerk/express';

import {
  followUser,
  isFollowingUser,
  unfollowUser,
} from '../controllers/follow.controller';

const router = Router();

router.post(
  '/follow',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('FOLLOW ENDPOINT HIT');

    next();
  },
  followUser,
);

router.post(
  '/unfollow',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('UNFOLLOW ENDPOINT HIT');

    next();
  },
  unfollowUser,
);

router.get(
  '/:clerkId/is-following',
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log('IS FOLLOWING ENDPOINT HIT');

    next();
  },
  isFollowingUser,
);

export default router;
