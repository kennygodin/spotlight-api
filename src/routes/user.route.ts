import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import {
  getCurrentUser,
  updateUserData,
  updateUserImageUrl,
} from '../controllers/user.controller';

const router = Router();

router.get('/current-user', requireAuth(), getCurrentUser);
router.put('/update-user', requireAuth(), updateUserData);
router.put('/update-user-image', requireAuth(), updateUserImageUrl);

export default router;
