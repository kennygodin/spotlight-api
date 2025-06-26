"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upstash_1 = __importDefault(require("../config/upstash"));
const ratelimiter = async (req, res, next) => {
    try {
        const { success } = await upstash_1.default.limit('my-rate-limit');
        if (!success) {
            res.status(429).json({ message: 'Please try again later' });
            return;
        }
        next();
    }
    catch (error) {
        console.log('Rate limit error', error);
        next(error);
    }
};
exports.default = ratelimiter;
