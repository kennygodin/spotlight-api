"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const cloudinary_1 = require("../libs/cloudinary");
const uploadFiles = async (req, res, next) => {
    try {
        if (!req.files) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }
        if (!req.files.file) {
            res.status(400).json({ error: 'Please provide a file with key: file' });
            return;
        }
        const file = Array.isArray(req.files.file)
            ? req.files.file[0]
            : req.files.file;
        if (!file) {
            res.status(400).json({ error: 'No file found' });
            return;
        }
        const { tempFilePath, mimetype } = file;
        if (!mimetype.startsWith('image')) {
            res.status(400).json({ error: 'Only images are accepted' });
            return;
        }
        const { url, publicId } = await (0, cloudinary_1.uploadToCloudinary)(tempFilePath, {
            folder: 'spotlight',
        });
        if (!publicId) {
            res.status(400).json({ error: 'Failed to upload asset' });
            return;
        }
        res.status(200).json({
            success: true,
            url,
            publicId,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFiles = uploadFiles;
