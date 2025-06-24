import { NextFunction, Request, Response, Router } from 'express';
import { requireAuth } from '@clerk/express';

import { createPost } from '../controllers/post.controller';

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

export default router;
