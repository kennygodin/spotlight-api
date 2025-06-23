import { NextFunction, Request, Response } from 'express';
import ratelimit from '../config/upstash';

const ratelimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success } = await ratelimit.limit('my-rate-limit');

    if (!success) {
      res.status(429).json({ message: 'Please try again later' });
      return;
    }
    next();
  } catch (error) {
    console.log('Rate limit error', error);
    next(error);
  }
};

export default ratelimiter;
