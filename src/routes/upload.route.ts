import express, { NextFunction, Request, Response } from 'express';
import { uploadFiles } from '../controllers/upload.controller';

const router = express.Router();

router.post(
  '/cloudinary/assets',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('🛑 Request reached assets endpoint');
    next();
  },
  uploadFiles,
);

export default router;
