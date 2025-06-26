"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedPosts = exports.getLoggedInUserPosts = exports.createPost = void 0;
require("../types/express");
const prisma_1 = require("../libs/prisma");
const cloudinary_1 = require("../libs/cloudinary");
const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const auth = req.auth();
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
        const { url: imageUrl, publicId } = await (0, cloudinary_1.uploadToCloudinary)(tempFilePath, {
            folder: 'spotlight',
        });
        if (!imageUrl || !publicId) {
            res.status(500).json({ message: 'Failed to upload image' });
            return;
        }
        const post = await prisma_1.db.post.create({
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
    }
    catch (error) {
        console.error('Error creating post:', error);
        next(error);
    }
};
exports.createPost = createPost;
const getLoggedInUserPosts = async (req, res, next) => {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const posts = await prisma_1.db.post.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
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
        res.status(200).json({
            status: 'success',
            message: 'User posts fetched',
            data: {
                posts,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLoggedInUserPosts = getLoggedInUserPosts;
const getFeedPosts = async (req, res, next) => {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const posts = await prisma_1.db.post.findMany({
            // where: {
            //   OR: [
            //     {
            //       userId: userId,
            //     },
            //     {
            //       user: {
            //         followers: {
            //           some: {
            //             followerId: userId,
            //           },
            //         },
            //       },
            //     },
            //   ],
            // },
            orderBy: {
                createdAt: 'desc',
            },
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
        res.status(200).json({
            status: 'success',
            message: 'Feed posts fetched',
            data: {
                posts,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFeedPosts = getFeedPosts;
