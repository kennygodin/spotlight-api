"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary_config_1.default.uploader.upload(filePath, {
            resource_type: 'auto',
            ...options,
        });
        // console.log(result);
        fs_1.default.unlinkSync(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
        };
    }
    catch (error) {
        console.error('Error while uploading to cloudinary', error);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        throw new Error('Error while uploading to cloudinary');
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
