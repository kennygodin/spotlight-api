import '../types/express';

import { NextFunction, Request, Response } from 'express';
import { db } from '../libs/prisma';

import { uploadToCloudinary } from '../libs/cloudinary';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { content } = req.body;
    const auth = req.auth!();
    const userId = auth?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!req.files || !req.files.image) {
      res.status(400).json({ message: 'Image file is required' });
      return;
    }

    const imageFile = Array.isArray(req.files.image)
      ? req.files.image[0]
      : req.files.image;

    if (!imageFile) {
      res.status(400).json({ message: 'No image file found' });
      return;
    }

    const { tempFilePath, mimetype } = imageFile;

    if (!mimetype.startsWith('image')) {
      res.status(400).json({ message: 'Only image files are accepted' });
      return;
    }

    const { url: imageUrl, publicId } = await uploadToCloudinary(tempFilePath, {
      folder: 'spotlight',
    });

    if (!imageUrl || !publicId) {
      res.status(500).json({ message: 'Failed to upload image' });
      return;
    }

    const post = await db.post.create({
      data: {
        imageUrl,
        content: content || '',
        userId,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      post: {
        ...post,
        publicId,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    next(error);
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const auth = req.auth!();
  const userId = auth?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await db.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const totalPosts = await db.post.count({
      where: {
        userId,
      },
    });

    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: 'success',
      message: 'User posts fetched',
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
