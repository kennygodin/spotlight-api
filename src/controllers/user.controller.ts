import { Request, Response } from 'express';
import { db } from '../libs/prisma';

export const syncUser = async (req: Request, res: Response) => {
  const { clerkId, name, email, avatar } = req.body;

  if (!clerkId || !email) {
    res.status(400).json({ message: 'Clerk ID and email are required' });
    return;
  }

  const existingUser = await db.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    const updatedUser = await db.user.update({
      where: { clerkId },
      data: {
        email,
        name,
        avatar,
        updatedAt: new Date(),
      },
    });

    res.status(200).json(updatedUser);
    return;
  }

  const newUser = await db.user.create({
    data: { clerkId, email, name, avatar, username: email.split('@')[0] },
  });

  res.status(201).json(newUser);
  return;
};
