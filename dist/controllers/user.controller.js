"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserImageUrl = exports.updateUserData = exports.getCurrentUser = exports.manageUserWebhooks = void 0;
const webhooks_1 = require("@clerk/express/webhooks");
const prisma_1 = require("../libs/prisma");
const cloudinary_1 = require("../libs/cloudinary");
const manageUserWebhooks = async (req, res) => {
    try {
        console.log('WEBHOOK HIT');
        const evt = await (0, webhooks_1.verifyWebhook)(req);
        if (evt.type === 'user.created') {
            const user = evt.data;
            const newUser = await prisma_1.db.user.create({
                data: {
                    clerkId: user.id,
                    firstName: user.first_name ?? '',
                    lastName: user.last_name ?? '',
                    email: user.email_addresses[0].email_address,
                    imageUrl: user.profile_image_url ?? '',
                },
            });
            console.log('Synced user to DB:', newUser.id);
        }
        res.status(200).json({ status: 'success', message: 'Webhook received' });
    }
    catch (err) {
        console.error('Error verifying webhook:', err);
        res
            .status(400)
            .json({ status: 'error', message: 'Error verifying webhook' });
    }
};
exports.manageUserWebhooks = manageUserWebhooks;
const getCurrentUser = async (req, res, next) => {
    try {
        console.log('CURRENT USER ENDPOINT HIT');
        const auth = req.auth();
        const userId = auth?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.db.user.findUnique({
            where: {
                clerkId: userId,
            },
        });
        if (!user) {
            res.status(404).json({ staus: 'error', message: 'User not found' });
            return;
        }
        res
            .status(200)
            .json({ status: 'success', message: 'Logged in user fetched', user });
    }
    catch (err) {
        console.error('Error fetching user:', err);
        res.status(400).json({ status: 'error', message: 'Error fetching user' });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateUserData = async (req, res, next) => {
    try {
        console.log('UPDATE USER ENDPOINT HIT');
        const auth = req.auth();
        const userId = auth?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await prisma_1.db.user.update({
            where: {
                clerkId: userId,
            },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                bio: req.body.bio,
            },
        });
        res.status(200).json({ status: 'success', message: 'User info updated' });
    }
    catch (err) {
        console.error('Error updating user:', err);
        res.status(400).json({ status: 'error', message: 'Error updating user' });
    }
};
exports.updateUserData = updateUserData;
const updateUserImageUrl = async (req, res, next) => {
    try {
        console.log('UPDATE USER IMAGE URL ENDPOINT HIT');
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
        await prisma_1.db.user.update({
            where: {
                clerkId: userId,
            },
            data: {
                imageUrl,
            },
        });
        res.status(200).json({
            status: 'success',
            message: 'Profile image updated',
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        next(error);
    }
};
exports.updateUserImageUrl = updateUserImageUrl;
