import { NextFunction, Request, Response } from 'express';
import { db } from '../libs/prisma';

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.auth!();
  const followerId = auth?.userId;
  const { followingId } = req.body;

  if (!followerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await db.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'User followed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.auth!();
  const followerId = auth?.userId;
  const { followingId } = req.body;

  if (!followerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await db.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const isFollowingUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.auth!();
  const followerId = auth?.userId;
  const followingId = req.params.clerkId;

  if (!followerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (followerId === followingId) {
    res.status(400).json({ message: "Can't follow yourself." });
    return;
  }

  try {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    const isFollowing = !!follow;

    res.status(200).json({ isFollowing });
  } catch (error) {
    next(error);
  }
};
